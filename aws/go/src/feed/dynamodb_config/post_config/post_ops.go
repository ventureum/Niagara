package post_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
  "log"
  "feed/feed_attributes"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/feed_item"
  "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)


type PostExecutor struct {
  client_config.DynamodbFeedClient
}


func (postExecutor *PostExecutor) CreatePostTable( ) {
  postExecutor.CreateTable(
    AttributeDefinitionsForPost,
    KeySchemaForPost,
    ProvisionedThroughputForPost,
    TableNameForPost,
  )
}

func (postExecutor *PostExecutor) DeletePostTable() {
  postExecutor.DeleteTable(TableNameForPost)
}

func (postExecutor *PostExecutor) UpsertPostItem(postItem *feed_item.PostItem) {
  readItem := postExecutor.ReadPostItem(postItem.ObjectId)
  if readItem.ObjectId == "" {
    postExecutor.AddNewPostItem(postItem)
  } else {
    // avoid to overwrite voters
    postExecutor.UpdateActivity(&postItem.Activity, postItem.ObjectId)
  }
}

func (postExecutor *PostExecutor) DeletePostItem(objectId string) {
  key := map[string]*dynamodb.AttributeValue{
    "objectId": {
      S: aws.String(objectId),
    },
  }
  postExecutor.DeleteItem(key, TableNameForPost, feed_item.PostItemType)
}

func (postExecutor *PostExecutor) AddNewPostItem(postItem *feed_item.PostItem) {
  var feedItem feed_item.FeedItem = *postItem
  postExecutor.AddItem(&feedItem, TableNameForPost, "")
}

func (postExecutor *PostExecutor) ReadPostItem(objectId string) *feed_item.PostItem {
  key := map[string]*dynamodb.AttributeValue{
    "objectId": {
      S: aws.String(objectId),
    },
  }
  item := postExecutor.ReadItem(key, TableNameForPost, feed_item.PostItemType)
  postItem := (*item).(feed_item.PostItem)
  return &postItem
}

func (postExecutor *PostExecutor) ReadRewards(objectId string) feed_attributes.Reward {
  input := &dynamodb.GetItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "objectId": {
        S: aws.String(objectId),
      },
    },
    ProjectionExpression: aws.String("activity.rewards" ),
    TableName: TableNameForPost,
  }

  result, err := postExecutor.C.GetItem(input);

  if err != nil {
    log.Printf("Failed to read PostItem with objectId: %s\n", objectId)
    log.Fatal(err.Error())
  }

  item := client_config.UnmarshalToFeedItem(result.Item, feed_item.PostItemType)
  return (*item).(feed_item.PostItem).Activity.Rewards
}

func (postExecutor *PostExecutor) UpdateActivity(
    activity *feed_attributes.Activity, objectId string) *feed_attributes.Activity {
  mapInfo, err := dynamodbattribute.MarshalMap(*activity)
  if err != nil {
    log.Printf("Failed to MarshalMap activity: %+v\n", *activity)
    log.Fatal(err.Error())
  }
  expressionAttributeValues :=  map[string]*dynamodb.AttributeValue {
    ":activity": {
      M: mapInfo,
    },
  }
  key := map[string]*dynamodb.AttributeValue {
    "objectId": {
      S: aws.String(objectId),
    },
  }
  updateExpression := aws.String("set activity = :activity")

  item := postExecutor.UpdateAttributes(
    nil,
      expressionAttributeValues,
      key,
      TableNameForPost,
      updateExpression,
      feed_item.PostItemType)

  postItem := (*item).(feed_item.PostItem)
  updatedActivity :=  postItem.Activity
  log.Printf("Successfully updated activity to be %+v for object: %s\n",
    updatedActivity, postItem.GetObject())
  return &updatedActivity
}

func (postExecutor *PostExecutor) AddVoter(voter feed_attributes.Voter, objectId string) {
  expressionAttributeValues := map[string]*dynamodb.AttributeValue{
    ":voter": {
      L: []*dynamodb.AttributeValue{
       {
          S: aws.String(string(voter)),
       },
      },
    },
  }
  key := map[string]*dynamodb.AttributeValue {
    "objectId": {
      S: aws.String(objectId),
    },
  }

  expressionAttributeNames := map[string]*string {
         "#ri": aws.String("voters"),
  }

  updateExpression := aws.String("set #ri = list_append(:voter, #ri)")

  item := postExecutor.UpdateAttributes(
    expressionAttributeNames,
    expressionAttributeValues,
    key,
    TableNameForPost,
    updateExpression,
    feed_item.PostItemType)

  postItem := (*item).(feed_item.PostItem)
  updatedVoters :=  postItem.Voters
  log.Printf("Successfully added voter %s to voters with object: %s\n, resulting in total %d voters",
    voter, postItem.GetObject(), len(updatedVoters))
}

func (postExecutor *PostExecutor) UpdateRewards (
    objectId string, rewards feed_attributes.Reward) feed_attributes.Reward {

  oldRewards := postExecutor.ReadRewards(objectId)
  newRewards := oldRewards.AddToReward(rewards)

  expressionAttributeValues := map[string]*dynamodb.AttributeValue{
    ":rewards": {
      S: aws.String(string(newRewards)),
    },
  }
  key := map[string]*dynamodb.AttributeValue {
    "objectId": {
      S: aws.String(objectId),
    },
  }
  updateExpression := aws.String("set activity.rewards = :rewards")

  item := postExecutor.UpdateAttributes(
    nil,
    expressionAttributeValues,
    key,
    TableNameForPost,
    updateExpression,
    feed_item.PostItemType)

  postItem := (*item).(feed_item.PostItem)
  updatedRewards :=  postItem.Activity.Rewards
  log.Printf("Successfully added rewards %s to PostItem with object: %s\n, resulting in total rewards: %s",
    rewards, postItem.GetObject(), updatedRewards)
  return updatedRewards
}
