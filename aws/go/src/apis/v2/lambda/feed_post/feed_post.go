package main

import (
  "gopkg.in/GetStream/stream-go2.v1"
  "feed/feed_attributes"
  "feed/feed_events"
  "feed/postgres_config/client_config"
  "feed/postgres_config/post_config"
  "feed/postgres_config/actor_reputations_record_config"
  "feed/postgres_config/post_replies_record_config"
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

func (request *Request) ToPostRecord() (*post_config.PostRecord) {
  return &post_config.PostRecord{
    Actor:      request.Actor,
    BoardId:    request.BoardId,
    ParentHash: request.ParentHash,
    PostHash:   request.PostHash,
    PostType:   feed_attributes.CreatePostTypeFromHashStr(request.TypeHash).Value(),
    Content:    request.Content.ToJsonText(),
  }
}

func (request *Request) ToPostEvent() (*feed_events.PostEvent) {
  return &feed_events.PostEvent{
    Actor:      request.Actor,
    BoardId:    request.BoardId,
    ParentHash: request.ParentHash,
    PostHash:   request.PostHash,
    PostType:   feed_attributes.CreatePostTypeFromHashStr(request.TypeHash),
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

  postRecord := request.ToPostRecord()
  postEvent := request.ToPostEvent();
  activity := feed_events.ConvertPostEventToActivity(postEvent, feed_attributes.OFF_CHAIN)

  postgresFeedClient := client_config.ConnectPostgresClient()
  postgresFeedClient.Begin()

  postExecutor := post_config.PostExecutor{*postgresFeedClient}
  actorReputationsRecordExecutor := actor_reputations_record_config.ActorReputationsRecordExecutor{
    *postgresFeedClient}
  postRepliesRecordExecutor := post_replies_record_config.PostRepliesRecordExecutor{*postgresFeedClient}

  updateCount :=  postExecutor.GetPostUpdateCountTx(postEvent.PostHash)
  reputationsPenalty := feed_attributes.PenaltyForPostType(
    feed_attributes.PostType(postEvent.PostType), updateCount)

  // Update Actor Reputation
  actorReputationsRecordExecutor.SubActorReputationsTx(request.Actor, reputationsPenalty)

  // Insert Post Record
  updatedTimestamp := postExecutor.UpsertPostRecordTx(postRecord)

  // Insert Activity to GetStream
  activity.Time = feed_attributes.CreateBlockTimestampFromTime(updatedTimestamp)
  getStreamClient := feed_events.GetStreamClient{C: client}
  getStreamClient.AddFeedActivityToGetStream(activity)

  // Update Post Replies Record
  if activity.Verb == feed_attributes.ReplyVerb {
    postRepliesRecord := post_replies_record_config.PostRepliesRecord {
      PostHash: postRecord.ParentHash,
      ReplyHash: postRecord.PostHash,
    }
    postRepliesRecordExecutor.UpsertPostRepliesRecordTx(&postRepliesRecord)
  }


  postgresFeedClient.Commit()

  response.Ok = true
  return response, nil
}

func main() {
  // TODO(david.shao): remove example when deployed to production
  //content := feed_attributes.Content{
  // Title: "titleSample1",
  // Text: "hello, world",
  //}
  //request := Request{
  // Actor:  "0x003",
  // BoardId: "0x02",
  // ParentHash: "0x007",
  // PostHash: "0x009",
  // TypeHash:  feed_attributes.ReplyPostType.Hash(),
  // Content: content,
  //}
  //Handler(request)

  lambda.Start(Handler)
}
