package upvote_count_config

import (
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
)


var AttributeDefinitionsForUpvoteCount = []*dynamodb.AttributeDefinition{
  {
    AttributeName: aws.String("postHash"),
    AttributeType: aws.String("S"),
  },
  {
    AttributeName: aws.String("evaluator"),
    AttributeType: aws.String("S"),
  },
}

var KeySchemaForUpvoteCount = []*dynamodb.KeySchemaElement{
  {
    AttributeName: aws.String("postHash"),
    KeyType:       aws.String("HASH"),
  },
  {
    AttributeName: aws.String("evaluator"),
    KeyType:       aws.String("RANGE"),
  },
}

var ProvisionedThroughputForUpvoteCount = &dynamodb.ProvisionedThroughput{
  ReadCapacityUnits:  aws.Int64(10),
  WriteCapacityUnits: aws.Int64(10),
}

var TableNameForUpvoteCount = aws.String("UpvoteCount")
