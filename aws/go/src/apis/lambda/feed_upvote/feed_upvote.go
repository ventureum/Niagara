package main

import (
  "feed/feed_attributes"
  "feed/dynamodb_config/feed_item"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/evaluation_config"
  "math/big"
  "github.com/aws/aws-lambda-go/lambda"
)


type Request struct {
  Upvoter string `json:"upvoter,required"`
  BoardId string `json:"boardId,required"`
  PostHash string `json:"postHash,required"`
  Value *big.Int `json:"value,required"`
}

type Response struct {
  Ok bool `json:"ok"`
}

func (request *Request) RequestToEvaluationItem() (*feed_item.EvaluationItem) {
  return &feed_item.EvaluationItem{
    ObjectId: request.PostHash,
    EvaluatorAddress: request.Upvoter,
    BoardId: request.BoardId,
    Value: feed_attributes.CreateVoteFromBigInt(request.Value),
    Timestamp: feed_attributes.CreateBlockTimestampFromNow(),
  }
}

func Handler(request Request) (Response, error) {
  response := Response {
    Ok: false,
  }

  dynamodbFeedClient := client_config.CreateDynamodbFeedClient()
  evaluationExecutor := evaluation_config.EvaluationExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  evaluationItem := request.RequestToEvaluationItem()
  evaluationExecutor.AddEvaluationItem(evaluationItem)
  response.Ok = true
  return response, nil
}

func main() {
  lambda.Start(Handler)
}
