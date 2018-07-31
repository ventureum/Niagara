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
  feedType := postEvent.FeedType
  return feed_attributes.CreateNewActivity(actor, verb, obj, timeStamp, feedType, to, extraParam)
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
