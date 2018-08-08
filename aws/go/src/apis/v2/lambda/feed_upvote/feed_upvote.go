package main

import (
  "feed/feed_attributes"
  "feed/postgres_config/client_config"
  "feed/postgres_config/post_votes_record_config"
  "feed/feed_events"
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

func ProcessRequest(request Request, response *Response) {
  defer func() {
    if errStr := recover(); errStr != nil { //catch
      response.Message = errStr.(string)
    }
  }()
  postgresFeedClient := client_config.ConnectPostgresClient()
  defer postgresFeedClient.Close()
  postVotesRecord := post_votes_record_config.PostVotesRecord {
    Actor: request.Actor,
    PostHash: request.PostHash,
    VoteType: feed_attributes.CreateVoteTypeFromValue(request.Value),
  }

  feed_events.ProcessPostVotesRecord(&postVotesRecord, postgresFeedClient)
  response.Ok = true
}

func Handler(request Request) (response Response, err error) {
  response.Ok = false
  ProcessRequest(request, &response)
  return response, nil
}

func main() {
  // TODO(david.shao): remove example when deployed to production
  //request := Request{
  //  Actor:  "0x001",
  //  BoardId: "0x02",
  //  PostHash: "0x009",
  //  Value: -1,
  //}
  //Handler(request)

  lambda.Start(Handler)
}
