package feed_events

import (
  "github.com/ethereum/go-ethereum/common"
  "math/big"
)

type Event interface{}


var NullHashString string = common.HexToHash("0x0").String()


type PostEventResult struct {
  Poster common.Address  // indexed
  BoardId common.Hash    // indexed
  ParentHash common.Hash
  PostHash common.Hash   // indexed
  IpfsPath common.Hash
  Timestamp *big.Int
}

type PostEvent struct {
  Poster string     // indexed
  BoardId string    // indexed
  ParentHash string
  PostHash string   // indexed
  IpfsPath string
  Timestamp *big.Int
}

type UpdatePostEventResult struct {
  Poster common.Address  // indexed
  PostHash common.Hash   // indexed
  IpfsPath common.Hash
  Timestamp *big.Int
}

type UpdatePostEvent struct {
  Poster string     // indexed
  PostHash string   // indexed
  IpfsPath string
  Timestamp *big.Int
}

type UpvoteEventResult struct {
  Poster common.Address // indexed
  BoardId common.Hash   // indexed
  PostHash common.Hash  // indexed
  Value *big.Int
  Timestamp *big.Int
}

type UpvoteEvent struct {
  Poster string    // indexed
  BoardId string   // indexed
  PostHash string  // indexed
  Value *big.Int
  Timestamp *big.Int
}

func (postEventResult *PostEventResult) ToPostEvent() *PostEvent {
  return &PostEvent {
    Poster: postEventResult.Poster.String(),
    BoardId: postEventResult.BoardId.String(),
    ParentHash: postEventResult.ParentHash.String(),
    PostHash: postEventResult.PostHash.String(),
    IpfsPath: postEventResult.IpfsPath.String(),
    Timestamp: postEventResult.Timestamp,
  }
}

func (updatePostEventResult *UpdatePostEventResult) ToUpdatePostEvent() *UpdatePostEvent {
  return &UpdatePostEvent {
    Poster: updatePostEventResult.Poster.String(),
    PostHash: updatePostEventResult.PostHash.String(),
    IpfsPath: updatePostEventResult.IpfsPath.String(),
    Timestamp: updatePostEventResult.Timestamp,
  }
}

func (upvoteEventResult *UpvoteEventResult) ToUpvoteEvent() *UpvoteEvent{
  return &UpvoteEvent {
    Poster: upvoteEventResult.Poster.String(),
    BoardId: upvoteEventResult.BoardId.String(),
    PostHash: upvoteEventResult.PostHash.String(),
    Value: upvoteEventResult.Value,
    Timestamp: upvoteEventResult.Timestamp,
  }
}
