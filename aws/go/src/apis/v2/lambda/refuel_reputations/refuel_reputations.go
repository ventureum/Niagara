package main

import (
  "feed/feed_attributes"
  "log"
  "feed/postgres_config/reputations_refuel_record_config"
  "feed/postgres_config/client_config"
  "feed/postgres_config/actor_reputations_record_config"
  "github.com/aws/aws-lambda-go/lambda"
)

type Request struct {
  UserAddress string `json:"userAddress,required"`
  Reputations int64 `json:"reputations,required"`
}

type Response struct {
  Ok      bool   `json:"ok"`
  Message string `json:"message,omitempty"`
}

func Handler(request Request) (Response, error) {
  response := Response {
    Ok: false,
  }

  reputations := feed_attributes.Reputation(request.Reputations)
  actor := request.UserAddress

  reputationsRefuelRecord := reputations_refuel_record_config.ReputationsRefuelRecord{
    Actor: actor,
    Reputations: reputations,
  }

  postgresFeedClient := client_config.ConnectPostgresClient()
  postgresFeedClient.Begin()
  reputationsRefuelRecordExecutor := reputations_refuel_record_config.ReputationsRefuelRecordExecutor{
    *postgresFeedClient}
  actorReputationsRecordExecutor := actor_reputations_record_config.ActorReputationsRecordExecutor{
    *postgresFeedClient}

  // Update Reputations Refuel Record
  reputationsRefuelRecordExecutor.UpsertReputationsRefuelRecordTx(&reputationsRefuelRecord)

  // Update Actor Reputations Record
  actorReputationsRecordExecutor.AddActorReputations(actor, reputations)

  postgresFeedClient.Commit()

  log.Printf("Refueled %d to actor %s", reputations, actor)

  response.Ok = true
  return response, nil
}

func main() {
  // TODO(david.shao): remove example when deployed to production
  //request := Request{
  // UserAddress: "0x003",
  // Reputations: 400000,
  //}
  //Handler(request)

  lambda.Start(Handler)
}
