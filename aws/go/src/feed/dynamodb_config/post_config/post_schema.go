package post_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForPost = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("objectType"),
    AttributeType: aws.String("S"),
  },
  {
    AttributeName: aws.String("objectId"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForPost = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("objectType"),
    KeyType:       aws.String("HASH"),
  },
  {
    AttributeName: aws.String("objectId"),
    KeyType:       aws.String("RANGE"),
  },
}

var ProvisionedThroughputForPost = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForPost = aws.String("Post")
