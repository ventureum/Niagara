package main

import (
  "os"
  "fmt"
  "log"
  "context"

  "github.com/ethereum/go-ethereum/ethclient"
  "github.com/ethereum/go-ethereum/common"
  "github.com/ethereum/go-ethereum"
  "github.com/ethereum/go-ethereum/core/types"
  "github.com/ethereum/go-ethereum/accounts/abi"
  "strings"
)

type Client struct {
  c *ethclient.Client
}


const LOCAL_SOCKET_URL string = "ws://127.0.0.1:8546"

func ConnectClient() (*Client) {
  rawURL := os.Getenv("SOCKET_URL")

  if rawURL == "" {
    rawURL = LOCAL_SOCKET_URL
  }

  client, err := ethclient.Dial(rawURL)
  if err != nil {
    log.Fatal(err)
  }

  return &Client{c:  client}
}

func (client *Client) Close() {
  client.c.Close()
}

func createFilterQuery(forumAddressHex string) ethereum.FilterQuery {
  forumAddress := common.HexToAddress(forumAddressHex)
  fmt.Println(forumAddress)
  query := ethereum.FilterQuery{
    Addresses: []common.Address{forumAddress},
    Topics: [][]common.Hash{{
      PostEventTopic,
      UpdatePostEventTopic,
      UpvoteEventTopic,
    }},
  }
  return query
}

func (client *Client) SubscribeFilterLogs(forumAddressHex string) {
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
      // TODO(david.shao): convert to FeedRecord and store it into dynamodb
      log.Println(*event)
    }
  }
}

func matchEvent(topics []common.Hash, data []byte) (*Event, error) {
  if len(topics) == 0 {
    return nil, nil
  }

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
      return NewEvent(*postEventResult.ToPostEvent()), nil

    case UpdatePostEventTopic:
      var updatePostEventResult UpdatePostEventResult
      updatePostEventAbi, _ := abi.JSON(strings.NewReader(UpdatePostEventABI))
      err := updatePostEventAbi.Unpack(&updatePostEventResult, "UpdatePost", data)
      if err != nil {
        return nil, err
      }
      updatePostEventResult.Poster = common.BytesToAddress(topics[1].Bytes())
      updatePostEventResult.PostHash = topics[2]
      return NewEvent(*updatePostEventResult.ToUpdatePostEvent()), nil

    case UpvoteEventTopic:
      var upvoteEventResult UpvoteEventResult
      upvoteEventAbi, _ := abi.JSON(strings.NewReader(UpvoteEventABI))
      err := upvoteEventAbi.Unpack(&upvoteEventResult, "Upvote", data)
      if err != nil {
        return nil, err
      }
      upvoteEventResult.Poster = common.BytesToAddress(topics[1].Bytes())
      upvoteEventResult.BoardId = topics[2]
      return NewEvent(*upvoteEventResult.ToUpvoteEvent()), nil
  }

  return nil, nil
}

