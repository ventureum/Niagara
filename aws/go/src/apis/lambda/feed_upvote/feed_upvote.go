package main

import (
  "feed/feed_attributes"
  "feed/dynamodb_config/feed_item"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/evaluation_config"
  "feed/dynamodb_config/upvote_count_config"
  "feed/dynamodb_config/reputation_record_config"
  "github.com/aws/aws-lambda-go/lambda"
)


type Request struct {
  Actor string `json:"actor,required"`
  BoardId string `json:"boardId,required"`
  PostHash string `json:"postHash,required"`
  Value int64 `json:"value,required"`
}

type Response struct {
  Ok      bool   `json:"ok"`
  Message string `json:"message,omitempty"`
}

func (request *Request) RequestToEvaluationItem() (*feed_item.EvaluationItem) {
  return &feed_item.EvaluationItem{
    UUID: feed_item.CreateUUIDForEvaluationItem(request.PostHash, request.Actor),
    PostHash:  request.PostHash,
    Evaluator: request.Actor,
    BoardId:   request.BoardId,
    Value:     feed_attributes.ValidateAndCreateVote(request.Value),
    Timestamp: feed_attributes.CreateBlockTimestampFromNow(),
  }
}

func Handler(request Request) (Response, error) {
  response := Response {
    Ok: false,
  }

  if !feed_attributes.ValidateVote(request.Value) {
    response.Message = "Invalid Vale for Vote"
    return response, nil
  }

  dynamodbFeedClient := client_config.CreateDynamodbFeedClient()
  reputationRecordExecutor := reputation_record_config.ReputationRecordExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  upvoteCountExecutor :=  upvote_count_config.UpvoteCountExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  evaluationExecutor := evaluation_config.EvaluationExecutor{DynamodbFeedClient: *dynamodbFeedClient}

  // Get vote count to calculate penalty
  voteCount := upvoteCountExecutor.ReadCount(request.PostHash, request.Actor)

  // TODO (david.shao):  replace costForUpVote by empirical function
  costForUpVote := feed_attributes.Reputation(1)
  reputationsPenalty := feed_attributes.PenaltyForUpvote(costForUpVote, voteCount)

  // Validate whether there are enough reputations to consume
  currentReputations := reputationRecordExecutor.ReadReputations(request.Actor)

  if currentReputations.ToBigInt().Cmp(reputationsPenalty.ToBigInt()) < 0 {
    response.Message = "Not enough reputations to consume for voting"
    return response, nil
  }

  // Update Reputation
  reputationRecordExecutor.UpdateReputations(request.Actor, reputationsPenalty.Neg())

  // Add Evaluation Item
  evaluationItem := request.RequestToEvaluationItem()
  evaluationExecutor.AddEvaluationItem(evaluationItem)

  // Increment Vote Count
  upvoteCountExecutor.UpdateCount(request.PostHash, request.Actor)

  response.Ok = true
  return response, nil
}

func main() {
   lambda.Start(Handler)
}
