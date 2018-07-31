package main

import (
  "math/big"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/reputation_record_config"
  "github.com/aws/aws-lambda-go/lambda"
)

type Request struct {
  UserAddress string `json:"userAddress,required"`
}

type Response struct {
  Ok      bool   `json:"ok"`
  Message string `json:"message,omitempty"`
  Reputations *big.Int `json:"reputations,omitempty"`
}

func Handler(request Request) (Response, error) {
  response := Response {
    Ok: false,
  }

  dynamodbFeedClient := client_config.CreateDynamodbFeedClient()
  reputationRecordExecutor := reputation_record_config.ReputationRecordExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  userAddress := request.UserAddress

  // Update Reputations
  response.Reputations = reputationRecordExecutor.ReadReputations(userAddress).ToBigInt()

  response.Ok = true
  return response, nil
}

func main() {
  lambda.Start(Handler)
}
