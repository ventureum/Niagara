package client_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "utils"
  "log"
  "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
  "github.com/aws/aws-sdk-go/aws/awserr"
  "github.com/aws/aws-sdk-go/aws"
  "feed/dynamodb_config/feed_item"
)

type DynamodbFeedClient struct {
  C *dynamodb.DynamoDB
}

func CreateDynamodbFeedClient() *DynamodbFeedClient{
  client := utils.CreateAwsDynamoDBClient()
  log.Println("Connected to Dynamodb Client")
  return &DynamodbFeedClient{C: client}
}

func (dynamodbClient *DynamodbFeedClient) CreateTable(
    attributeDefinitions []*dynamodb.AttributeDefinition,
    keySchema []*dynamodb.KeySchemaElement,
    provisionedThroughput *dynamodb.ProvisionedThroughput,
    tableName *string) {
  input := &dynamodb.CreateTableInput{
    AttributeDefinitions: attributeDefinitions,
    KeySchema: keySchema,
    ProvisionedThroughput: provisionedThroughput,
    TableName: tableName,
  }

  if _, err := dynamodbClient.C.CreateTable(input); err != nil {
    log.Printf("Failed to create Table %s\n", *tableName)
    log.Fatal(err.Error())
  } else {
    log.Printf("Table %s has been created\n", *tableName)
  }
}

func (dynamodbClient *DynamodbFeedClient) DeleteTable(tableName *string) {
  deleteTableInput := dynamodb.DeleteTableInput {
    TableName: tableName,
  }
  if _, err := dynamodbClient.C.DeleteTable(&deleteTableInput); err != nil {
    if aerr, ok := err.(awserr.Error); ok {
      if aerr.Code() != dynamodb.ErrCodeResourceNotFoundException {
        log.Printf("Table %s Faied to be deleted\n", *tableName)
        log.Fatal(aerr.Error())
      } else {
        log.Printf("Table %s does not exist\n", *tableName)
      }
    } else {
      log.Fatal(aerr.Error())
    }
  } else {
    describeTableInput := dynamodb.DescribeTableInput {
      TableName: tableName,
    }
    if err := dynamodbClient.C.WaitUntilTableNotExists(&describeTableInput); err != nil {
      log.Printf("Table %s Faied to be deleted\n", *tableName)
      log.Fatal(err.Error())
    } else {
      log.Printf("Table %s has been deleted sucessfully\n", *tableName)
    }
  }
}

func (dynamodbClient *DynamodbFeedClient) AddItem(item *feed_item.FeedItem, tableName *string) {
  mapInfo, err := dynamodbattribute.MarshalMap(*item)

  if err != nil {
    log.Printf("Failed to marshal item: %+v\n", *item)
    log.Fatal(err.Error())
  }

  input := &dynamodb.PutItemInput{
    Item: mapInfo,
    TableName: tableName,
  }

  if _, err := dynamodbClient.C.PutItem(input); err != nil {
    log.Printf("Failed to put item into Table %s: %+v\n", *tableName, *item)
    log.Fatal(err)
  }
  log.Printf("Successfully added Item to Table %s: %+v\n", *tableName, *item)
}

func (dynamodbClient *DynamodbFeedClient) DeleteItem(
  key map[string]*dynamodb.AttributeValue, tableName *string, feedItemType feed_item.FeedItemType) {
  input := &dynamodb.DeleteItemInput{
    Key: key,
    ReturnValues: aws.String("ALL_OLD"),
    TableName: tableName,
  }

  deletedItem, err := dynamodbClient.C.DeleteItem(input);

  if err != nil {
    log.Printf("Failed to Delete Item with key: %+v\n", key)
    log.Fatal(err.Error())
  }
  item := UnmarshalToFeedItem(deletedItem.Attributes, feedItemType)
  log.Printf("Successfully deleted Item %+v from Table %s\n", item, *tableName)
}

func (dynamodbClient *DynamodbFeedClient) ReadItem(
  key map[string]*dynamodb.AttributeValue, tableName *string, feedItemType feed_item.FeedItemType) *feed_item.FeedItem {
  input := &dynamodb.GetItemInput{
    Key: key,
    TableName: tableName,
  }

  result, err := dynamodbClient.C.GetItem(input);

  if err != nil {
    log.Printf("Failed to read Item from Table %s with key: %+v\n", *tableName, key)
    log.Fatal(err.Error())
  }

  return UnmarshalToFeedItem(result.Item, feedItemType)
}

func UnmarshalToFeedItem(
  attributeValues map[string]*dynamodb.AttributeValue, feedItemType feed_item.FeedItemType) *feed_item.FeedItem {
  var item feed_item.FeedItem
  var err error

  switch feedItemType {
    case feed_item.PostItemType:
      var postItem feed_item.PostItem
      err = dynamodbattribute.UnmarshalMap(attributeValues, &postItem)
      item = postItem
  }
  if err != nil {
    log.Printf("Failed to unmarshal Item with attributeValues: %+v\n", attributeValues)
    log.Fatal(err.Error())
  }
  return &item
}
