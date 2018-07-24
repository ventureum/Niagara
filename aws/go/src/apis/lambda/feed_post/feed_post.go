package main

import (
  "gopkg.in/GetStream/stream-go2.v1"
  "feed/feed_attributes"
  "feed/feed_events"
  "feed/dynamodb_config/feed_item"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/post_config"
  "github.com/aws/aws-lambda-go/lambda"
)


type Request struct {
  Poster string `json:"poster,required"`
  BoardId string `json:"boardId,required"`
  ParentHash string `json:"parentHash,required"`
  PostHash string `json:"postHash,required"`
  Type string `json:"type,required"`
  Content feed_attributes.Content `json:"content,required"`
  GetStreamApiKey string `json:"getStreamApiKey,omitEmpty"`
  GetStreamApiSecret string `json:"getStreamApiSecret,omitEmpty"`
}

type Response struct {
  Ok bool `json:"ok"`
}

func (request *Request) ToPostEvent() (*feed_events.PostEvent) {
  return &feed_events.PostEvent{
    Poster: request.Poster,
    BoardId: request.BoardId,
    ParentHash: request.ParentHash,
    PostHash: request.PostHash,
    IpfsPath: "",
    TypeHash: feed_attributes.TypeHash(request.Type),
    Timestamp: feed_attributes.CreateBlockTimestampFromNow(),
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
  activity := feed_events.ConvertPostEventToActivity(postEvent)

  if activity.Extra == nil {
    activity.Extra = map[string]interface{}{}
  }

  activity.Extra["source"] = feed_attributes.DataBase
  getStreamClient := feed_events.GetStreamClient{C: client}
  getStreamClient.AddFeedActivityToGetStream(activity)

  activity.Extra["content"] = request.Content
  postItem := feed_item.CreatePostItem(activity)

  dynamodbFeedClient := client_config.CreateDynamodbFeedClient()
  postExecutor := post_config.PostExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  postExecutor.UpsertPostItem(postItem)

  response.Ok = true
  return response, nil
}

func main() {
  lambda.Start(Handler)
}
