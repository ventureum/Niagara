package exchange_request_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForExchangeRequest = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("address"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForExchangeRequest = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("address"),
    KeyType:       aws.String("HASH"),
  },
}

var ProvisionedThroughputForExchangeRequest = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForExchangeRequest = aws.String("ExchangeRequest")
