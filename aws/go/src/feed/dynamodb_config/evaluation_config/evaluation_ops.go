package evaluation_config

import (
  "feed/dynamodb_config/feed_item"
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
  "feed/dynamodb_config/client_config"
)

type EvaluationExecutor struct {
  client_config.DynamodbFeedClient
}


func (evaluationExecutor *EvaluationExecutor) CreateEvaluationTable( ) {
  evaluationExecutor.CreateTable(
    AttributeDefinitionsForEvaluation,
    KeySchemaForEvaluation,
    ProvisionedThroughputForEvaluation,
    TableNameForEvaluation,
  )
}

func (evaluationExecutor *EvaluationExecutor) DeleteEvaluationTable() {
  evaluationExecutor.DeleteTable(TableNameForEvaluation)
}

func (evaluationExecutor *EvaluationExecutor) AddEvaluationItem(evaluationItem *feed_item.EvaluationItem) {
  var feedItem feed_item.FeedItem = *evaluationItem
  evaluationExecutor.AddItem(&feedItem, TableNameForEvaluation)
}

func (evaluationExecutor *EvaluationExecutor) DeleteEvaluationItem(objectId string) {
  key := map[string]*dynamodb.AttributeValue{
    "objectId": {
      S: aws.String(objectId),
    },
  }
  evaluationExecutor.DeleteItem(key, TableNameForEvaluation, feed_item.EvaluationItemType)
}

func (evaluationExecutor *EvaluationExecutor) ReadEvaluationItem(objectId string) *feed_item.EvaluationItem {
  key := map[string]*dynamodb.AttributeValue{
    "objectId": {
      S: aws.String(objectId),
    },
  }
  item := evaluationExecutor.ReadItem(key, TableNameForEvaluation, feed_item.EvaluationItemType)
  evaluationItem := (*item).(feed_item.EvaluationItem)
  return &evaluationItem
}
