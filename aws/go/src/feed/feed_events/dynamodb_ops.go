package feed_events

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
  "log"
  "github.com/aws/aws-sdk-go/aws/awserr"
  "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
  "utils"
  "feed/feed_attributes"
)

type DynamodbFeedClient struct {
  c *dynamodb.DynamoDB
}


func CreateDynamodbFeedClient() *DynamodbFeedClient{
  client := utils.CreateAwsDynamoDBClient()
  log.Println("Connected to Dynamodb Client")
  return &DynamodbFeedClient{c: client}
}

func (dynamodbClient *DynamodbFeedClient) CreateFeedEventsTable() {
  input := &dynamodb.CreateTableInput{
    AttributeDefinitions: AttributeDefinitionsForFeedEvents,
    KeySchema: KeySchemaForFeedEvents,
    ProvisionedThroughput: ProvisionedThroughputForFeedEvents,
    TableName: TableNameForFeedEvents,
  }

  if _, err := dynamodbClient.c.CreateTable(input); err != nil {
    log.Println("Failed to create Feed Events Table")
    log.Fatal(err.Error())
  } else {
    log.Println("Feed Events Table has been created")
  }
}

func (dynamodbClient *DynamodbFeedClient) DeleteFeedEventsTable() {
  deleteTableInput := dynamodb.DeleteTableInput {
    TableName: TableNameForFeedEvents,
  }
  if _, err := dynamodbClient.c.DeleteTable(&deleteTableInput); err != nil {
    if aerr, ok := err.(awserr.Error); ok {
      if aerr.Code() != dynamodb.ErrCodeResourceNotFoundException {
        log.Println("Feed Events Table Faied to be deleted")
        log.Fatal(aerr.Error())
      } else {
        log.Println("Feed Events Table does not exist" )
      }
    } else {
      log.Fatal(aerr.Error())
    }
  } else {
    describeTableInput := dynamodb.DescribeTableInput {
      TableName: TableNameForFeedEvents,
    }
    if err := dynamodbClient.c.WaitUntilTableNotExists(&describeTableInput); err != nil {
      log.Println("Feed Events Table Faied to be deleted")
      log.Fatal(err.Error())
    } else {
      log.Println("Feed Events Table has been deleted sucessfully")
    }
  }
}

func (dynamodbClient *DynamodbFeedClient) AddItemIntoFeedEvents(itemForFeedEvents *ItemForFeedActivity) {
  mapInfo, err := dynamodbattribute.MarshalMap(*itemForFeedEvents)

  if err != nil {
    log.Printf("Failed to marshal itemForFeedEvents: %+v\n", itemForFeedEvents)
    log.Fatal(err.Error())
  }

  input := &dynamodb.PutItemInput{
    Item: mapInfo,
    TableName: TableNameForFeedEvents,
  }

  if _, err := dynamodbClient.c.PutItem(input); err != nil {
    log.Printf("Failed to put item into Feed Events Table: %+v\n", itemForFeedEvents)
    log.Fatal(err)
  }
  log.Printf("Successfully added ItemForFeedActivity to Feed Events Table with object: %s\n",
    itemForFeedEvents.GetObject())
}

func (dynamodbClient *DynamodbFeedClient) DeleteItemFromFeedEvents(objectId string) {
  input := &dynamodb.DeleteItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "objectId": {
        S: aws.String(objectId),
      },
    },
    ReturnValues: aws.String("ALL_OLD"),
    TableName: TableNameForFeedEvents,
  }

  deletedItem, err := dynamodbClient.c.DeleteItem(input);

  if err != nil {
    log.Printf("Failed to Delete ItemForFeedActivity with objectId: %s\n", objectId)
    log.Fatal(err.Error())
  }
  item := unmarshalToItemForFeedActivity(deletedItem.Attributes)
  log.Printf("Successfully deleted ItemForFeedActivity from Feed Events Table with object: %s \n",
    item.GetObject())
}

func (dynamodbClient *DynamodbFeedClient) ReadItemFromFeedEvents(objectId string) *ItemForFeedActivity {
  input := &dynamodb.GetItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "objectId": {
        S: aws.String(objectId),
      },
    },
    TableName: TableNameForFeedEvents,
  }

  result, err := dynamodbClient.c.GetItem(input);

  if err != nil {
    log.Printf("Failed to read ItemForFeedActivity with objectId: %s\n", objectId)
    log.Fatal(err.Error())
  }

  return unmarshalToItemForFeedActivity(result.Item)
}

func (dynamodbClient *DynamodbFeedClient) ReadRewardsFromFeedEvents(objectId string) feed_attributes.Reward {

  input := &dynamodb.GetItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "objectId": {
        S: aws.String(objectId),
      },
    },
    ProjectionExpression: aws.String("activity.rewards" ),
    TableName: TableNameForFeedEvents,
  }

  result, err := dynamodbClient.c.GetItem(input);

  if err != nil {
    log.Printf("Failed to read ItemForFeedActivity with objectId: %s\n", objectId)
    log.Fatal(err.Error())
  }

  itemForFeedActivity := unmarshalToItemForFeedActivity(result.Item)
  return itemForFeedActivity.Activity.Rewards
}

func (dynamodbClient *DynamodbFeedClient) UpdateItemForFeedEventsWithRewards (
    objectId string, rewards feed_attributes.Reward) *ItemForFeedActivity {

  oldRewards := dynamodbClient.ReadRewardsFromFeedEvents(objectId)
  newRewards :=  oldRewards.AddToReward(rewards)

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
        TableName:        TableNameForFeedEvents,
        ReturnValues:     aws.String("ALL_NEW"),
        UpdateExpression: aws.String("set activity.rewards = :rewards"),
      }
  updatedValue, err := dynamodbClient.c.UpdateItem(input)

  if err != nil {
    log.Printf("Failed to add rewards %+v to ItemForFeedActivity with objectId: %s\n", rewards, objectId)
    log.Fatal(err.Error())
    return nil
  }

  item := unmarshalToItemForFeedActivity(updatedValue.Attributes)
  updatedRewards := item.Activity.Rewards
  log.Printf("Successfully added rewards %s to ItemForFeedActivity with object: %s\n", rewards, item.GetObject())
  log.Printf("Rewards updated to %s for ItemForFeedActivity with object: %s\n", updatedRewards, item.GetObject())
  return item
}

func unmarshalToItemForFeedActivity(item map[string]*dynamodb.AttributeValue) *ItemForFeedActivity {
  var itemForFeedActivity ItemForFeedActivity

  err := dynamodbattribute.UnmarshalMap(item, &itemForFeedActivity)
  if err != nil {
    log.Printf("Failed to unmarshal ItemForFeedActivity with object: %s\n", itemForFeedActivity.GetObject())
    log.Fatal(err.Error())
  }
  return &itemForFeedActivity
}
