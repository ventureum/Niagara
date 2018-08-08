package main

import (
  "feed/feed_attributes"
  "feed/feed_events"
  "feed/dynamodb_config/feed_item"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/post_config"
  "github.com/mitchellh/mapstructure"
  "fmt"
  "github.com/aws/aws-lambda-go/lambda"
  "math/big"
)


type Request struct {
  PostHash string `json:"postHash,required"`
}

type ResponseContent struct {
  Actor string `json:"actor,omitempty"`
  BoardId string `json:"boardId,omitempty"`
  ParentHash string `json:"parentHash,omitempty"`
  PostHash string `json:"postHash,omitempty"`
  PostType string `json:"postType,omitempty"`
  Content feed_attributes.Content `json:"content,omitempty"`
  Rewards *big.Int `json:"rewards,omitempty"`
  RepliesLength *big.Int `json:"repliesLength,omitempty"`
}

type Response struct {
  Post ResponseContent `json:"post,omitempty"`
  Ok bool `json:"ok"`
  Message string `json:"message,omitempty"`
}

func PostItemToResponse(postItem *feed_item.PostItem) (*ResponseContent) {
  activity := postItem.Activity
  actor := string(activity.Actor)

  postHash := postItem.ObjectId
  var content feed_attributes.Content
  var boardId string
  mapstructure.Decode(activity.Extra["content"], &content)
  var parentHash string
  if activity.Verb == feed_attributes.ReplyVerb {
    var object feed_attributes.Object
    mapstructure.Decode(activity.Extra["post"], &object)
    parentHash = object.ObjId
    boardId = string(activity.To[0].UserId)
  } else {
    parentHash = feed_events.NullHashString
    boardId = string(activity.To[1].UserId)
  }
  return &ResponseContent{
    Actor: actor,
    BoardId: boardId,
    ParentHash: parentHash,
    PostHash: postHash,
    PostType: string(activity.PostType),
    Content: content,
  }
}

func Handler(request Request) (Response, error) {
  response := Response {
    Ok: false,
  }

  dynamodbFeedClient := client_config.CreateDynamodbFeedClient()
  postExecutor := post_config.PostExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  objectId := request.PostHash
  postItem := postExecutor.ReadPostItem(objectId)

  if postItem.ObjectId == "" {
    response.Message = fmt.Sprintf("No Post exists for postHash: %s", request.PostHash)
    return response, nil
  }

  response.Post = *PostItemToResponse(postItem)
  response.Ok = true
  return response, nil
}

func main() {
  lambda.Start(Handler)
}
