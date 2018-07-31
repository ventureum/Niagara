package upvote_count_config

import (
  "feed/dynamodb_config/feed_item"
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
  "feed/dynamodb_config/client_config"
  "log"
)

type UpvoteCountExecutor struct {
  client_config.DynamodbFeedClient
}

func (upvoteCountExecutor *UpvoteCountExecutor) CreateUpvoteCountTable( ) {
  upvoteCountExecutor.CreateTable(
    AttributeDefinitionsForUpvoteCount,
    KeySchemaForUpvoteCount,
    ProvisionedThroughputForUpvoteCount,
    TableNameForUpvoteCount,
  )
}

func (upvoteCountExecutor *UpvoteCountExecutor) DeleteUpvoteCountTable() {
  upvoteCountExecutor.DeleteTable(TableNameForUpvoteCount)
}

func (upvoteCountExecutor *UpvoteCountExecutor) AddUpvoteCountItem(upvoteCountItem *feed_item.UpvoteCountItem) {
  var feedItem feed_item.FeedItem = *upvoteCountItem
  upvoteCountExecutor.AddItem(&feedItem, TableNameForUpvoteCount, "")
}

func (upvoteCountExecutor *UpvoteCountExecutor) DeleteUpvoteCountItem(postHash string, evaluator string) {
  key := map[string]*dynamodb.AttributeValue{
    "postHash": {
      S: aws.String(postHash),
    },
    "evaluator": {
      S: aws.String(evaluator),
    },
  }
  upvoteCountExecutor.DeleteItem(key, TableNameForUpvoteCount, feed_item.UpvoteCountItemType)
}

func (upvoteCountExecutor *UpvoteCountExecutor) ReadUpvoteCountItem(
    postHash string, evaluator string) *feed_item.UpvoteCountItem {
  key := map[string]*dynamodb.AttributeValue{
    "postHash": {
      S: aws.String(postHash),
    },
    "evaluator": {
      S: aws.String(evaluator),
    },
  }
  item := upvoteCountExecutor.ReadItem(key, TableNameForUpvoteCount, feed_item.UpvoteCountItemType)
  upvoteCountItem := (*item).(feed_item.UpvoteCountItem)
  return &upvoteCountItem
}

func (upvoteCountExecutor *UpvoteCountExecutor) ReadCount(postHash string, evaluator string) int64 {
  input := &dynamodb.GetItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "postHash": {
        S: aws.String(postHash),
      },
      "evaluator": {
        S: aws.String(evaluator),
      },
    },
    ProjectionExpression: aws.String("voteCount" ),
    TableName: TableNameForUpvoteCount,
  }

  result, err := upvoteCountExecutor.C.GetItem(input);

  if err != nil {
    log.Printf("Failed to read VoteCount for postHash %s and evaluator %s\n", postHash, evaluator)
    log.Fatal(err.Error())
  }

  item := client_config.UnmarshalToFeedItem(result.Item, feed_item.UpvoteCountItemType)
  return (*item).(feed_item.UpvoteCountItem).VoteCount
}

func (upvoteCountExecutor *UpvoteCountExecutor) UpdateCount(postHash string, evaluator string) int64 {

  expressionAttributeValues := map[string]*dynamodb.AttributeValue{
    ":incr": {
      N: aws.String("1"),
    },
    ":zero": {
      N: aws.String("0"),
    },
  }
  key := map[string]*dynamodb.AttributeValue {
    "postHash": {
      S: aws.String(postHash),
    },
    "evaluator": {
      S: aws.String(evaluator),
    },
  }
  updateExpression := aws.String("set voteCount = if_not_exists(voteCount, :zero) + :incr")

  item := upvoteCountExecutor.UpdateAttributes(
    nil,
    expressionAttributeValues,
    key,
    TableNameForUpvoteCount,
    updateExpression,
    feed_item.UpvoteCountItemType)

  upvoteCountItem := (*item).(feed_item.UpvoteCountItem)
  updatedCount :=  upvoteCountItem.VoteCount
  log.Printf("Successfully increase count to  %d for postHash %s and evaluator %s\n",
    updatedCount, postHash, evaluator)
  return updatedCount
}
