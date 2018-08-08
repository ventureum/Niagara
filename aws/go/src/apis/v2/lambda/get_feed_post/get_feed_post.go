package main

import (
  "feed/feed_attributes"
  "feed/postgres_config/client_config"
  "feed/postgres_config/post_config"
  "feed/postgres_config/post_replies_record_config"
  "feed/postgres_config/post_rewards_record_config"
  "github.com/aws/aws-lambda-go/lambda"
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
  Rewards int64 `json:"rewards,omitempty"`
  RepliesLength int64 `json:"repliesLength,omitempty"`
}

type Response struct {
  Post ResponseContent `json:"post,omitempty"`
  Ok bool `json:"ok"`
  Message string `json:"message,omitempty"`
}

func PostRecordResultToResponseContent(result *post_config.PostRecordResult) *ResponseContent {
  return &ResponseContent{
    Actor: result.Actor,
    BoardId: result.Actor,
    ParentHash: result.ParentHash,
    PostType: result.PostType,
    Content: *result.Content,
  }
}

func Handler(request Request) (Response, error) {
  response := Response {
    Ok: false,
  }

  postHash := request.PostHash
  postgresFeedClient := client_config.ConnectPostgresClient()
  postgresFeedClient.Begin()

  postExecutor := post_config.PostExecutor{*postgresFeedClient}
  postRewardsRecordExecutor := post_rewards_record_config.PostRewardsRecordExecutor{*postgresFeedClient}
  postRepliesRecordExecutor := post_replies_record_config.PostRepliesRecordExecutor{*postgresFeedClient}

  postRecordResult := postExecutor.GetPostRecordTx(postHash).ToPostRecordResult()

  response.Post = *PostRecordResultToResponseContent(postRecordResult)
  response.Post.RepliesLength = postRepliesRecordExecutor.GetPostRepliesRecordCountTx(postHash)
  response.Post.Rewards = postRewardsRecordExecutor.GetPostRewardsTx(postHash).Value()

  postgresFeedClient.Commit()

  response.Ok = true
  return response, nil
}

func main() {
  // TODO(david.shao): remove example when deployed to production
  //request := Request{
  //  PostHash: "0x007",
  //}
  //response, _ := Handler(request)
  //fmt.Printf("%+v", response)

  lambda.Start(Handler)
}
