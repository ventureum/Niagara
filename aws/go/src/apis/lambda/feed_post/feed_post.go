package main

import (
  "gopkg.in/GetStream/stream-go2.v1"
  "feed/feed_attributes"
  "feed/feed_events"
  "feed/dynamodb_config/feed_item"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/post_config"
  "feed/dynamodb_config/reputation_record_config"
  "log"
  "github.com/aws/aws-lambda-go/lambda"
)


type Request struct {
  Actor string `json:"actor,required"`
  BoardId string `json:"boardId,required"`
  ParentHash string `json:"parentHash,required"`
  PostHash string `json:"postHash,required"`
  TypeHash string `json:"typeHash,required"`
  Content feed_attributes.Content `json:"content,required"`
  GetStreamApiKey string `json:"getStreamApiKey,omitempty"`
  GetStreamApiSecret string `json:"getStreamApiSecret,omitempty"`
}

type Response struct {
  Ok bool `json:"ok"`
  Message string `json:"message,omitempty"`
}

func (request *Request) ToPostEvent() (*feed_events.PostEvent) {
  return &feed_events.PostEvent{
    Actor:      request.Actor,
    BoardId:    request.BoardId,
    ParentHash: request.ParentHash,
    PostHash:   request.PostHash,
    PostType:   feed_attributes.CreatePostTypeFromHashStr(request.TypeHash),
    Timestamp:  feed_attributes.CreateBlockTimestampFromNow(),
  }
}

func Handler(request Request) (Response, error) {
  var err error
  var client *stream.Client
  if request.GetStreamApiKey != "" && request.GetStreamApiSecret != "" {
    client, err = stream.NewClient(request.GetStreamApiKey, request.GetStreamApiSecret)
  } else {
    client, err = stream.NewClientFromEnv()
  }

  response := Response {
    Ok: false,
  }
  if err != nil {
    return response, err
  }

  postEvent := request.ToPostEvent();
  activity := feed_events.ConvertPostEventToActivity(postEvent, feed_attributes.OFF_CHAIN)

  if activity.Extra == nil {
    activity.Extra = map[string]interface{}{}
  }

  dynamodbFeedClient := client_config.CreateDynamodbFeedClient()
  postExecutor := post_config.PostExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  reputationRecordExecutor := reputation_record_config.ReputationRecordExecutor{DynamodbFeedClient: *dynamodbFeedClient}

  updateCount :=  postExecutor.ReadUpdateCount(postEvent.PostHash)
  reputationsPenalty := feed_attributes.PenaltyForPostType(
    feed_attributes.PostType(postEvent.PostType), updateCount)

  // Validate whether there are enough reputations to consume
  currentReputations := reputationRecordExecutor.ReadReputations(request.Actor)

  if currentReputations.ToBigInt().Cmp(reputationsPenalty.ToBigInt()) < 0 {
    message := "Not enough reputations to consume for voting"
    log.Printf(message)
    response.Message = message
    return response, nil
  }

  // Update Reputation
  reputationRecordExecutor.UpdateReputations(request.Actor, reputationsPenalty.Neg())


  getStreamClient := feed_events.GetStreamClient{C: client}
  getStreamClient.AddFeedActivityToGetStream(activity)

  activity.Extra["content"] = request.Content
  postItem := feed_item.CreatePostItem(activity)
  postExecutor.UpsertPostItem(postItem)

  response.Ok = true
  return response, nil
}

func main() {
  lambda.Start(Handler)
}
