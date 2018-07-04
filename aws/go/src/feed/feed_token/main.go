package main

import (
  "gopkg.in/GetStream/stream-go2.v1"
  "github.com/aws/aws-lambda-go/lambda"
)

type Request struct {
  FeedSlug string `json:"feedSlug"`
  UserId string `json:"userId"`
}

type Response struct {
  FeedToken string `json:"feedToken"`
  Ok bool `json:"ok"`
}

func Handler(request Request) (Response, error) {
  client, err := stream.NewClientFromEnv()
  response := Response {
    FeedToken: "",
    Ok: false,
  }
  if err != nil {
    return response, err
  }
  flat := client.FlatFeed(request.FeedSlug, request.UserId)
  response.FeedToken = flat.RealtimeToken(false)
  response.Ok = true
  return response, nil
}


func main() {
  lambda.Start(Handler)
}
