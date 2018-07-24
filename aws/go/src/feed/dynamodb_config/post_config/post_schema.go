package post_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForPost = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("objectId"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForPost = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("objectId"),
    KeyType:       aws.String("HASH"),
  },
}

var ProvisionedThroughputForPost = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForPost = aws.String("Post")
