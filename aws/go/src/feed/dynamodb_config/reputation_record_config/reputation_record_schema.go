package reputation_record_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForReputationRecord = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("userAddress"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForReputationRecord = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("userAddress"),
    KeyType:       aws.String("HASH"),
  },
}

var ProvisionedThroughputForReputationRecord = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForReputationRecord = aws.String("ReputationRecord")
