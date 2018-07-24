package post_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
  "log"
  "feed/feed_attributes"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/feed_item"
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

func (postExecutor *PostExecutor) AddPostItem(postItem *feed_item.PostItem) {
  var feedItem feed_item.FeedItem = *postItem
  postExecutor.AddItem(&feedItem, TableNameForPost, "")
}

func (postExecutor *PostExecutor) DeletePostItem(objectId string) {
  key := map[string]*dynamodb.AttributeValue{
    "objectId": {
      S: aws.String(objectId),
    },
  }
  postExecutor.DeleteItem(key, TableNameForPost, feed_item.PostItemType)
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

func (postExecutor *PostExecutor) UpdateRewards (
    objectId string, rewards feed_attributes.Reward) feed_attributes.Reward {

  oldRewards := postExecutor.ReadRewards(objectId)
  newRewards := oldRewards.AddToReward(rewards)

  input := &dynamodb.UpdateItemInput{
    ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
      ":rewards": {
        S: aws.String(string(newRewards)),
      },
    },
    Key: map[string]*dynamodb.AttributeValue{
      "objectId": {
        S: aws.String(objectId),
      },
    },
    TableName:        TableNameForPost,
    ReturnValues:     aws.String("ALL_NEW"),
    UpdateExpression: aws.String("set activity.rewards = :rewards"),
  }
  updatedValue, err := postExecutor.C.UpdateItem(input)

  if err != nil {
    log.Printf("Failed to add rewards %+v to PostItem with objectId: %s\n", rewards, objectId)
    log.Fatal(err.Error())
  }

  item := client_config.UnmarshalToFeedItem(updatedValue.Attributes, feed_item.PostItemType)
  postItem := (*item).(feed_item.PostItem)
  updatedRewards :=  postItem.Activity.Rewards
  log.Printf("Successfully added rewards %s to PostItem with object: %s\n, resulting in total rewards: %s",
    rewards, postItem.GetObject(), updatedRewards)
  return updatedRewards
}
