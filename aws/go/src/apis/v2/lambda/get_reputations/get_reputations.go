package main

import (
  "feed/postgres_config/client_config"
  "feed/postgres_config/actor_reputations_record_config"
  "github.com/aws/aws-lambda-go/lambda"
)

type Request struct {
  UserAddress string `json:"userAddress,required"`
}

type Response struct {
  Ok      bool   `json:"ok"`
  Message string `json:"message,omitempty"`
  Reputations int64 `json:"reputations,omitempty"`
}

func Handler(request Request) (Response, error) {
  response := Response {
    Ok: false,
  }

  actor := request.UserAddress
  postgresFeedClient := client_config.ConnectPostgresClient()
  actorReputationsRecordExecutor := actor_reputations_record_config.ActorReputationsRecordExecutor{
    *postgresFeedClient}

  // Update Reputations
  response.Reputations = actorReputationsRecordExecutor.GetActorReputations(actor).Value()
  response.Ok = true
  return response, nil
}

func main() {
  // TODO(david.shao): remove example when deployed to production
  //request := Request{
  //  UserAddress: "0x001",
  //}
  //response, _ := Handler(request)
  //fmt.Printf("%+v", response)

  lambda.Start(Handler)
}
