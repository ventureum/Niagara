package main

import (
  "math/big"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/reputation_record_config"
  "feed/feed_attributes"
  "log"
  "github.com/aws/aws-lambda-go/lambda"
)

type Request struct {
  UserAddress string `json:"userAddress,required"`
  Reputations *big.Int `json:"reputations,required"`
}

type Response struct {
  Ok      bool   `json:"ok"`
  Message string `json:"message,omitempty"`
}

func Handler(request Request) (Response, error) {
  response := Response {
    Ok: false,
  }

  dynamodbFeedClient := client_config.CreateDynamodbFeedClient()
  reputationRecordExecutor := reputation_record_config.ReputationRecordExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  reputations := feed_attributes.CreateReputationFromBigInt(request.Reputations)
  userAddress := request.UserAddress

  // Update Reputations
  reputationRecordExecutor.UpdateReputations(userAddress, reputations)

  log.Printf("Refueled %s to userAddress %s", reputations, userAddress)

  response.Ok = true
  return response, nil
}

func main() {
  lambda.Start(Handler)
}
