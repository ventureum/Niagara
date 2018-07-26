package post_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
  "log"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/feed_item"
  "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
  "feed/feed_attributes"
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

func (postExecutor *PostExecutor) UpsertPostItem(postItem *feed_item.PostItem) *feed_item.PostItem {
  mapInfo, err := dynamodbattribute.MarshalMap(postItem.Activity)
  if err != nil {
    log.Printf("Failed to MarshalMap activity: %+v\n", postItem.Activity)
    log.Fatal(err.Error())
  }
  expressionAttributeValues :=  map[string]*dynamodb.AttributeValue {
    ":activity": {
      M: mapInfo,
    },
    ":incr": {
      N: aws.String("1"),
    },
    ":zero": {
      N: aws.String("0"),
    },
  }
  key := map[string]*dynamodb.AttributeValue {
    "objectId": {
      S: aws.String(postItem.ObjectId),
    },
  }
  updateExpression := aws.String("set activity = :activity, updateCount = if_not_exists(updateCount, :zero) + :incr")

  item := postExecutor.UpdateAttributes(
    nil,
      expressionAttributeValues,
      key,
      TableNameForPost,
      updateExpression,
      feed_item.PostItemType)

  updatedPostItem := (*item).(feed_item.PostItem)
  log.Printf("Successfully updated postItem for objectId %s: %+v\n",
     postItem.ObjectId, updatedPostItem)
  return &updatedPostItem
}

func (postExecutor *PostExecutor) ReadUpdateCount(objectId string) int64 {
  input := &dynamodb.GetItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "objectId": {
        S: aws.String(objectId),
      },
    },
    ProjectionExpression: aws.String("updateCount" ),
    TableName: TableNameForPost,
  }

  result, err := postExecutor.C.GetItem(input);

  if err != nil {
    log.Printf("Failed to read UpdateCount with objectId: %s\n", objectId)
    log.Fatal(err.Error())
  }
  item := client_config.UnmarshalToFeedItem(result.Item, feed_item.PostItemType)
  return (*item).(feed_item.PostItem).UpdateCount
}

func (postExecutor *PostExecutor) GetFeedType(objectId string) feed_attributes.FeedType {
  input := &dynamodb.GetItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "objectId": {
        S: aws.String(objectId),
      },
    },
    ProjectionExpression: aws.String("activity.feedType" ),
    TableName: TableNameForPost,
  }

  result, err := postExecutor.C.GetItem(input);

  if err != nil {
    log.Printf("Failed to get FeedType for objectId: %s\n", objectId)
    log.Fatal(err.Error())
  }
  item := client_config.UnmarshalToFeedItem(result.Item, feed_item.PostItemType)
  return (*item).(feed_item.PostItem).Activity.FeedType
}
