package main

import (
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/post_config"
  "feed/dynamodb_config/profile_config"
  "feed/dynamodb_config/evaluation_config"
  "feed/dynamodb_config/exchange_request_config"
)

func main () {
  dynamodbFeedClient := client_config.CreateDynamodbFeedClient()

  postExecutor := post_config.PostExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  postExecutor.DeletePostTable()
  postExecutor.CreatePostTable()

  profileExecutor := profile_config.ProfileExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  profileExecutor.DeleteProfileTable()
  profileExecutor.CreateProfileTable()

  evaluationExecutor := evaluation_config.EvaluationExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  evaluationExecutor.DeleteEvaluationTable()
  evaluationExecutor.CreateEvaluationTable()

  exchangeRequestExecutor := exchange_request_config.ExchangeRequestExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  exchangeRequestExecutor.DeleteExchangeRequestTable()
  exchangeRequestExecutor.CreateExchangeRequestTable()
}
