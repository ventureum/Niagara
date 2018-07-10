package feed_events

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForFeedEvents = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("object"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForFeedEvents = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("object"),
    KeyType:       aws.String("HASH"),
  },
}

var ProvisionedThroughputForFeedEvents = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForFeedEvents = aws.String("FeedEvents")
