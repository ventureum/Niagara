package evaluation_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForEvaluation = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("objectId"),
    AttributeType: aws.String("S"),
  },
  {
    AttributeName: aws.String("evaluatorAddress"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForEvaluation = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("objectId"),
    KeyType:       aws.String("HASH"),
  },
  {
    AttributeName: aws.String("evaluatorAddress"),
    KeyType:       aws.String("RANGE"),
  },
}

var ProvisionedThroughputForEvaluation = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForEvaluation = aws.String("Evaluation")

var ConditionExpressionWithoutOverwriting = "attribute_not_exists(objectId) and attribute_not_exists(evaluatorAddress)"
