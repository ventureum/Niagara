package feed_events

import (
  "os"
  "log"
  "context"

  "github.com/ethereum/go-ethereum/ethclient"
  "github.com/ethereum/go-ethereum/common"
  "github.com/ethereum/go-ethereum"
  "github.com/ethereum/go-ethereum/core/types"
  "github.com/ethereum/go-ethereum/accounts/abi"
  "strings"
  "reflect"
  "feed/feed_attributes"
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/feed_item"
  "feed/dynamodb_config/post_config"
  "feed/dynamodb_config/evaluation_config"
  "feed/dynamodb_config/upvote_count_config"
  client_config2 "feed/postgres_config/client_config"
  post_config2 "feed/postgres_config/post_config"
  "feed/postgres_config/actor_reputations_record_config"
  "feed/postgres_config/post_replies_record_config"
  "feed/postgres_config/post_votes_record_config"
  "feed/postgres_config/post_reputations_record_config"
)


type EthClient struct {
  c *ethclient.Client
}


const LOCAL_SOCKET_URL string = "ws://127.0.0.1:8546"


func ConnectEthClient() (*EthClient) {
  rawURL := os.Getenv("SOCKET_URL")

  if rawURL == "" {
    rawURL = LOCAL_SOCKET_URL
  }

  client, err := ethclient.Dial(rawURL)
  if err != nil {
    log.Fatal(err)
  }
  log.Println("Connected to Ethereum EthClient")
  return &EthClient{c:  client}
}

func (client *EthClient) Close() {
  client.c.Close()
  log.Println("Disconnected to Ethereum EthClient")
}

func createFilterQuery(forumAddressHex string) ethereum.FilterQuery {
  forumAddress := common.HexToAddress(forumAddressHex)
  query := ethereum.FilterQuery{
    Addresses: []common.Address{forumAddress},
    Topics: [][]common.Hash{{
      PostEventTopic,
      UpvoteEventTopic,
    }},
  }
  return query
}

func (client *EthClient) SubscribeFilterLogs(
    forumAddressHex string, getStreamClient *GetStreamClient, dynamodbClient *client_config.DynamodbFeedClient) {
  logs := make(chan types.Log)
  filterQuery := createFilterQuery(forumAddressHex)
  sub, err := client.c.SubscribeFilterLogs(context.Background(), filterQuery, logs)
  if err != nil {
    log.Fatal(err)
  }
  log.Println("Subscribed to FilterLogs")
  for {
    select {
    case err := <-sub.Err():
      log.Fatal(err)
    case vLog := <-logs:
      event, err := matchEvent(vLog.Topics, vLog.Data)
      if err != nil {
        log.Println(err)
      }
      log.Printf("Processing Event: %+v\n", *event)
      processEvent(event, getStreamClient, dynamodbClient)
    }
  }
}

func (client *EthClient) SubscribeFilterLogsV2(
    forumAddressHex string, getStreamClient *GetStreamClient, postgresFeedClient *client_config2.PostgresFeedClient) {
  logs := make(chan types.Log)
  filterQuery := createFilterQuery(forumAddressHex)
  sub, err := client.c.SubscribeFilterLogs(context.Background(), filterQuery, logs)
  if err != nil {
    log.Fatal(err)
  }
  log.Println("Subscribed to FilterLogs")
  for {
    select {
    case err := <-sub.Err():
      log.Fatal(err)
    case vLog := <-logs:
      event, err := matchEvent(vLog.Topics, vLog.Data)
      if err != nil {
        log.Println(err)
      }
      log.Printf("Processing Event: %+v\n", *event)
      processEventV2(event, getStreamClient, postgresFeedClient)
    }
  }
}


func matchEvent(topics []common.Hash, data []byte) (*Event, error) {
  if len(topics) == 0 {
    return nil, nil
  }
  var event Event
  switch topics[0] {
    case PostEventTopic:
      var postEventResult PostEventResult
      postEventAbi, _ := abi.JSON(strings.NewReader(PostEventABI))
      err := postEventAbi.Unpack(&postEventResult, "Post", data)
      if err != nil {
        return nil, err
      }
      postEventResult.Poster = common.BytesToAddress(topics[1].Bytes())
      postEventResult.BoardId = topics[2]
      postEventResult.PostHash = topics[3]
      event = *postEventResult.ToPostEvent()
      return &event, nil

    case UpvoteEventTopic:
      var upvoteEventResult UpvoteEventResult
      upvoteEventAbi, _ := abi.JSON(strings.NewReader(UpvoteEventABI))
      err := upvoteEventAbi.Unpack(&upvoteEventResult, "Upvote", data)
      if err != nil {
        return nil, err
      }
      upvoteEventResult.Actor = common.BytesToAddress(topics[1].Bytes())
      upvoteEventResult.BoardId = topics[2]
      upvoteEventResult.PostHash = topics[3]
      event = *upvoteEventResult.ToUpvoteEvent()
      return &event, nil
  }

  return nil, nil
}

func processEvent(
  event *Event, getStreamClient *GetStreamClient, dynamodbClient *client_config.DynamodbFeedClient) {
  switch reflect.TypeOf(*event) {
    case reflect.TypeOf(PostEvent{}):
       postExecutor := post_config.PostExecutor{DynamodbFeedClient: *dynamodbClient}
       postEvent := (*event).(PostEvent)
       activity := ConvertPostEventToActivity(&postEvent, feed_attributes.ON_CHAIN)
       getStreamClient.AddFeedActivityToGetStream(activity)
       postExecutor.UpsertPostItem(feed_item.CreatePostItem(activity))
    case reflect.TypeOf(UpvoteEvent{}):
       evaluationExecutor := evaluation_config.EvaluationExecutor{DynamodbFeedClient: *dynamodbClient}
       upvoteEvent := (*event).(UpvoteEvent)
       evaluationExecutor.AddEvaluationItem(ConvertUpvoteEventToEvaluationItem(&upvoteEvent))
       upvoteCountExecutor :=  upvote_count_config.UpvoteCountExecutor{DynamodbFeedClient: *dynamodbClient}
       upvoteCountExecutor.UpdateCount(upvoteEvent.PostHash, upvoteEvent.Actor)
  }
}

func processEventV2(
    event *Event, getStreamClient *GetStreamClient, postgresFeedClient *client_config2.PostgresFeedClient) {
  switch reflect.TypeOf(*event) {
    case reflect.TypeOf(PostEvent{}):
      postEvent := (*event).(PostEvent)
      activity := ConvertPostEventToActivity(&postEvent, feed_attributes.ON_CHAIN)
      postRecord := ConvertPostEventToPostRecord(&postEvent)
      postgresFeedClient.Begin()
      postExecutor := post_config2.PostExecutor{*postgresFeedClient}
      postRepliesRecordExecutor := post_replies_record_config.PostRepliesRecordExecutor{*postgresFeedClient}

      // Insert Post Record
      updatedTimestamp := postExecutor.UpsertPostRecordTx(postRecord)

      // Insert Activity to GetStream
      activity.Time = feed_attributes.CreateBlockTimestampFromTime(updatedTimestamp)
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
    case reflect.TypeOf(UpvoteEvent{}):
      upvoteEvent := (*event).(UpvoteEvent)
      actor := upvoteEvent.Actor
      postHash := upvoteEvent.PostHash
      var voteType feed_attributes.VoteType
      if upvoteEvent.Value < 0 {
        voteType = feed_attributes.DOWN_VOTE_TYPE
      } else {
        voteType = feed_attributes.UP_VOTE_TYPE
      }

      postgresFeedClient.Begin()
      actorReputationsRecordExecutor := actor_reputations_record_config.ActorReputationsRecordExecutor{
        *postgresFeedClient}
      postReputationsRecordExecutor := post_reputations_record_config.PostReputationsRecordExecutor{*postgresFeedClient}
      postVotesRecordExecutor := post_votes_record_config.PostVotesRecordExecutor{*postgresFeedClient}

      // Record current vote
      postVotesRecord :=  post_votes_record_config.PostVotesRecord {
        Actor: actor,
        PostHash: postHash,
        VoteType: voteType,
      }
      postVotesRecordExecutor.UpsertPostVotesRecordTx(&postVotesRecord)

      // Update Actor Reputation For the postHash
      postReputationsRecord := post_reputations_record_config.PostReputationsRecord{
        Actor: actor,
        PostHash: postHash,
        Reputations: actorReputationsRecordExecutor.GetActorReputationsTx(actor),
        LatestVoteType: voteType,
      }
      postReputationsRecordExecutor.UpsertPostReputationsRecordTx(&postReputationsRecord)
      postgresFeedClient.Commit()
  }
}

func ConvertPostEventToActivity(postEvent *PostEvent, source feed_attributes.Source) *feed_attributes.Activity {
  var verb feed_attributes.Verb
  var to []feed_attributes.FeedId
  var obj feed_attributes.Object
  extraParam := map[string]interface{}{
    "source": source,
  }

  if postEvent.ParentHash == NullHashString {
    obj = feed_attributes.Object{
      ObjType:feed_attributes.PostObjectType,
      ObjId: postEvent.PostHash,
    }
    verb = feed_attributes.SubmitVerb
    to = []feed_attributes.FeedId {
      {
        FeedSlug: feed_attributes.BoardFeedSlug,
        UserId: feed_attributes.AllBoardId,
      },
      {
        FeedSlug: feed_attributes.BoardFeedSlug,
        UserId: feed_attributes.UserId(postEvent.BoardId),
      },
    }
  } else {
    obj = feed_attributes.Object{
      ObjType:feed_attributes.ReplyObjectType,
      ObjId: postEvent.PostHash,
    }
    verb = feed_attributes.ReplyVerb
    extraParam["post"] = feed_attributes.Object{
        ObjType: feed_attributes.PostObjectType,
        ObjId: postEvent.ParentHash,
    }
    to = []feed_attributes.FeedId {
      {
        FeedSlug: feed_attributes.CommentFeedSlug,
        UserId: feed_attributes.UserId(postEvent.ParentHash),
      },
    }
  }

  actor := feed_attributes.Actor(postEvent.Actor)
  timeStamp := postEvent.Timestamp
  postType := postEvent.PostType
  return feed_attributes.CreateNewActivity(actor, verb, obj, timeStamp, postType, to, extraParam)
}

func ConvertUpvoteEventToEvaluationItem(upvoteEvent *UpvoteEvent) *feed_item.EvaluationItem {
    return &feed_item.EvaluationItem {
      UUID: feed_item.CreateUUIDForEvaluationItem(upvoteEvent.PostHash, upvoteEvent.Actor),
      PostHash: upvoteEvent.PostHash,
      Evaluator: upvoteEvent.Actor,
      BoardId: upvoteEvent.BoardId,
      Timestamp: upvoteEvent.Timestamp,
      Value: upvoteEvent.Value,
    }
}

func ConvertPostEventToPostRecord(postEvent *PostEvent) (*post_config2.PostRecord) {
  return &post_config2.PostRecord{
    Actor:      postEvent.Actor,
    BoardId:    postEvent.BoardId,
    ParentHash: postEvent.ParentHash,
    PostHash:   postEvent.PostHash,
    PostType:   postEvent.PostType.Value(),
  }
}
