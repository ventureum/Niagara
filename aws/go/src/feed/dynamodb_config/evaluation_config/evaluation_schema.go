package evaluation_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForEvaluation = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("objectType"),
    AttributeType: aws.String("S"),
  },
  {
    AttributeName: aws.String("objectId"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForEvaluation = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("objectType"),
    KeyType:       aws.String("HASH"),
  },
  {
    AttributeName: aws.String("objectId"),
    KeyType:       aws.String("RANGE"),
  },
}

var ProvisionedThroughputForEvaluation = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForEvaluation = aws.String("Evaluation")
