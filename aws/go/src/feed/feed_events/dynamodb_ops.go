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

  _, err = dynamodbClient.c.PutItem(input)

  if err != nil {
    log.Printf("Failed to put item into Feed Events Table: %+v\n", itemForFeedEvents)
    log.Fatal(err)
  }

  log.Printf("Successfully added ItemForFeedActivity to Feed Events Table with object: %s\n",
    GetObjectFromItemForFeedActivity(itemForFeedEvents).Value())
}

func (dynamodbClient *DynamodbFeedClient) DeleteItemFromFeedEvents(object feed_attributes.Object) {
  input := &dynamodb.DeleteItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "object": {
        S: aws.String(object.Value()),
      },
    },
    TableName: TableNameForFeedEvents,
  }

  if _, err := dynamodbClient.c.DeleteItem(input); err != nil {
    log.Printf("Failed to Delete ItemForFeedActivity with object: %s\n", object.Value())
    log.Fatal(err.Error())
  }

  log.Printf("Successfully deleted ItemForFeedActivity from Feed Events Table with object: %s \n",
    object.Value())
}

func (dynamodbClient *DynamodbFeedClient) ReadItemFromFeedEvents(object feed_attributes.Object) *ItemForFeedActivity {
  input := &dynamodb.GetItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "object": {
        S: aws.String(object.Value()),
      },
    },
    TableName: TableNameForFeedEvents,
  }

  result, err := dynamodbClient.c.GetItem(input);

  if err != nil {
    log.Printf("Failed to read ItemForFeedActivity with object: %s\n", object.Value())
    log.Fatal(err.Error())
  }

  return unmarshalToItemForFeedActivity(result.Item, object)
}

func (dynamodbClient *DynamodbFeedClient) ReadRewardsFromFeedEvents(object feed_attributes.Object) feed_attributes.Reward {

  input := &dynamodb.GetItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "object": {
        S: aws.String(object.Value()),
      },
    },
    ProjectionExpression: aws.String("activity.rewards" ),
    TableName: TableNameForFeedEvents,
  }

  result, err := dynamodbClient.c.GetItem(input);

  if err != nil {
    log.Printf("Failed to read ItemForFeedActivity with object: %s\n", object.Value())
    log.Fatal(err.Error())
  }

  itemForFeedActivity := unmarshalToItemForFeedActivity(result.Item, object)
  return GetRewardsFromItemForFeedActivity(itemForFeedActivity)
}

func (dynamodbClient *DynamodbFeedClient) UpdateItemForFeedEventsWithRewards (
    object feed_attributes.Object, rewards feed_attributes.Reward) *ItemForFeedActivity {

  oldRewards := dynamodbClient.ReadRewardsFromFeedEvents(object)
  newRewards :=  oldRewards.AddToReward(rewards)

  input := &dynamodb.UpdateItemInput{
        ExpressionAttributeValues: map[string]*dynamodb.AttributeValue{
          ":rewards": {
            S: aws.String(string(newRewards)),
          },
        },
        Key: map[string]*dynamodb.AttributeValue{
          "object": {
            S: aws.String(object.Value()),
          },
        },
        TableName:        TableNameForFeedEvents,
        ReturnValues:     aws.String("ALL_NEW"),
        UpdateExpression: aws.String("set activity.rewards = :rewards"),
      }
  updatedValue, err := dynamodbClient.c.UpdateItem(input)

  if err != nil {
    log.Printf("Failed to add rewards %d to ItemForFeedActivity with object: %s\n", rewards, object.Value())
    log.Fatal(err.Error())
    return nil
  }

  log.Printf("Successfully added rewards %s to ItemForFeedActivity with object: %s\n", rewards, object.Value())
  item := unmarshalToItemForFeedActivity(updatedValue.Attributes, object)
  updatedRewards := GetRewardsFromItemForFeedActivity(item)
  log.Printf("Rewards updated to %s for ItemForFeedActivity with object: %s\n", updatedRewards, object.Value())
  return item
}

func unmarshalToItemForFeedActivity(
    item map[string]*dynamodb.AttributeValue , object feed_attributes.Object) *ItemForFeedActivity {
  var itemForFeedActivity ItemForFeedActivity

  if object.ObjType == feed_attributes.PostObjectType {
    itemForFeedPostActivity := ItemForFeedPostActivity{}
    err := dynamodbattribute.UnmarshalMap(item, &itemForFeedPostActivity)
    if err != nil {
      log.Printf("Failed to unmarshal ItemForFeedActivity with object: %s\n", object.Value())
      log.Fatal(err.Error())
    }
    itemForFeedActivity = itemForFeedPostActivity

  }

  if object.ObjType == feed_attributes.CommentObjectType {
    itemForFeedCommentActivity := ItemForCommentActivity{}
    err := dynamodbattribute.UnmarshalMap(item, &itemForFeedCommentActivity)
    if err != nil {
      log.Printf("Failed to unmarshal ItemForFeedActivity with object: %s\n", object.Value())
      log.Fatal(err.Error())
    }
    itemForFeedActivity = itemForFeedCommentActivity
  }

  return &itemForFeedActivity
}
