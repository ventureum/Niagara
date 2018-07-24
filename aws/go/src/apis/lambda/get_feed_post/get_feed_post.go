package main

import (
  "feed/feed_attributes"
  "feed/feed_events"
  "feed/dynamodb_config/feed_item"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/post_config"
  "github.com/mitchellh/mapstructure"
  "github.com/aws/aws-lambda-go/lambda"
)


type Request struct {
  PostHash string `json:"postHash,required"`
}

type ResponseContent struct {
  Poster string `json:"poster,required"`
  BoardId string `json:"boardId,required"`
  ParentHash string `json:"parentHash,required"`
  PostHash string `json:"postHash,required"`
  Type string `json:"type,required"`
  Content feed_attributes.Content `json:"content,required"`
}

type Response struct {
  Post ResponseContent `json:"post"`
  Ok bool `json:"ok"`
}

func PostItemToResponse(postItem *feed_item.PostItem) (*ResponseContent) {
  activity := postItem.Activity
  poster := string(activity.Actor)
  boardId := string(activity.To[1].UserId)
  postHash := postItem.ObjectId
  typeHash := string(activity.TypeHash)
  var content feed_attributes.Content
  mapstructure.Decode(activity.Extra["content"], &content)
  var parentHash string
  if activity.Verb == feed_attributes.ReplyVerb {
    parentHash = activity.Extra["post"].(feed_attributes.Object).ObjId
  } else {
    parentHash = feed_events.NullHashString
  }
  return &ResponseContent{
    Poster: poster,
    BoardId: boardId,
    ParentHash: parentHash,
    PostHash: postHash,
    Type: typeHash,
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

  response.Post = *PostItemToResponse(postItem)
  response.Ok = true
  return response, nil
}

func main() {
  lambda.Start(Handler)
}
