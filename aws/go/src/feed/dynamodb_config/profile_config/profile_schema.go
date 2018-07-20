package profile_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForProfile = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("userAddress"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForProfile = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("userAddress"),
    KeyType:       aws.String("HASH"),
  },
}

var ProvisionedThroughputForProfile = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForProfile = aws.String("Profile")
