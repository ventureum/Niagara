package feed_events

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForFeedEvents = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("objectType"),
    AttributeType: aws.String("S"),
  },
  {
    AttributeName: aws.String("objectId"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForFeedEvents = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("objectType"),
    KeyType:       aws.String("HASH"),
  },
  {
    AttributeName: aws.String("objectId"),
    KeyType:       aws.String("RANGE"),
  },
}

var ProvisionedThroughputForFeedEvents = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForFeedEvents = aws.String("FeedEvents")
