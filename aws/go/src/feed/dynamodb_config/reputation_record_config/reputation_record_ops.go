package reputation_record_config

import (
  "feed/dynamodb_config/feed_item"
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
  "feed/dynamodb_config/client_config"
  "feed/feed_attributes"
  "log"
)

type ReputationRecordExecutor struct {
  client_config.DynamodbFeedClient
}

func (reputationRecordExecutor *ReputationRecordExecutor) CreateReputationRecordTable( ) {
  reputationRecordExecutor.CreateTable(
    AttributeDefinitionsForReputationRecord,
    KeySchemaForReputationRecord,
    ProvisionedThroughputForReputationRecord,
    TableNameForReputationRecord,
  )
}

func (reputationRecordExecutor *ReputationRecordExecutor) DeleteReputationRecordTable() {
  reputationRecordExecutor.DeleteTable(TableNameForReputationRecord)
}

func (reputationRecordExecutor *ReputationRecordExecutor) AddReputationRecordItem(reputationRecordItem *feed_item.ReputationRecordItem) {
  var feedItem feed_item.FeedItem = *reputationRecordItem
  reputationRecordExecutor.AddItem(&feedItem, TableNameForReputationRecord, "")
}

func (reputationRecordExecutor *ReputationRecordExecutor) DeleteReputationRecordItem(userAddress string) {
  key := map[string]*dynamodb.AttributeValue{
    "userAddress": {
      S: aws.String(userAddress),
    },
  }
  reputationRecordExecutor.DeleteItem(key, TableNameForReputationRecord, feed_item.ReputationRecordItemType)
}

func (reputationRecordExecutor *ReputationRecordExecutor) ReadReputationRecordItem(
    userAddress string) *feed_item.ReputationRecordItem {
  key := map[string]*dynamodb.AttributeValue{
    "userAddress": {
      S: aws.String(userAddress),
    },
  }
  item := reputationRecordExecutor.ReadItem(key, TableNameForReputationRecord, feed_item.ReputationRecordItemType)
  reputationRecordItem := (*item).(feed_item.ReputationRecordItem)
  return &reputationRecordItem
}

func (reputationRecordExecutor *ReputationRecordExecutor) ReadReputations(userAddress string) feed_attributes.Reputation {
  input := &dynamodb.GetItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "userAddress": {
        S: aws.String(userAddress),
      },
    },
    ProjectionExpression: aws.String("reputations" ),
    TableName: TableNameForReputationRecord,
  }

  result, err := reputationRecordExecutor.C.GetItem(input);

  if err != nil {
    log.Printf("Failed to read Reputations with userAddress: %s\n", userAddress)
    log.Fatal(err.Error())
  }

  if len(result.Item) == 0 {
    return feed_attributes.Reputation("0")
  } else {
    return feed_attributes.Reputation(*result.Item["reputations"].N)
  }
}



func (reputationRecordExecutor *ReputationRecordExecutor) UpdateReputations (
    userAddress string, reputations feed_attributes.Reputation) feed_attributes.Reputation {

  expressionAttributeValues := map[string]*dynamodb.AttributeValue{
    ":reputations": {
      N: aws.String(string(reputations)),
    },
    ":zero": {
      N: aws.String("0"),
    },
  }
  key := map[string]*dynamodb.AttributeValue {
    "userAddress": {
      S: aws.String(userAddress),
    },
  }
  updateExpression := aws.String("set reputations = if_not_exists(reputations, :zero) + :reputations")

  input := &dynamodb.UpdateItemInput{
    ExpressionAttributeValues: expressionAttributeValues,
    Key: key,
    TableName:        TableNameForReputationRecord,
    ReturnValues:     aws.String("UPDATED_NEW"),
    UpdateExpression: updateExpression,
  }

  updatedValue, err := reputationRecordExecutor.C.UpdateItem(input)

  if err != nil {
    log.Printf("Failed to update Reputations with userAddress: %s\n", userAddress)
    log.Fatal(err.Error())
  }

  updatedReputations :=  *updatedValue.Attributes["reputations"].N
  if reputations.Sign() == -1 {
    log.Printf("Successfully substracted reputations %s from userAddress %s, resulting in Reputaions: %s \n",
      reputations.Abs(), userAddress, updatedReputations)
  } else {
    log.Printf("Successfully Add reputations %s to userAddress %s, resulting in Reputaions: %s \n",
      reputations.Abs(), userAddress, updatedReputations)
  }

  return feed_attributes.Reputation(updatedReputations)
}