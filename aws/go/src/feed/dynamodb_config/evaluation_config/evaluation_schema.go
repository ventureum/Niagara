package evaluation_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForEvaluation = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("uuid"),
    AttributeType: aws.String("S"),
  },
  {
    AttributeName: aws.String("timestamp"),
    AttributeType: aws.String("N"),
  },
}

var KeySchemaForEvaluation = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("uuid"),
    KeyType:       aws.String("HASH"),
  },
  {
    AttributeName: aws.String("timestamp"),
    KeyType:       aws.String("RANGE"),
  },
}

var ProvisionedThroughputForEvaluation = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForEvaluation = aws.String("Evaluation")
