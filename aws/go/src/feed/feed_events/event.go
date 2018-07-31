package feed_events

import (
  "github.com/ethereum/go-ethereum/common"
  "feed/feed_attributes"
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
  TypeHash [4]byte
  Timestamp *big.Int
}

type PostEvent struct {
  Actor string     // indexed
  BoardId string    // indexed
  ParentHash string
  PostHash string   // indexed
  FeedType feed_attributes.FeedType
  Timestamp feed_attributes.BlockTimestamp
}

type UpvoteEventResult struct {
  Actor   common.Address // indexed
  BoardId   common.Hash    // indexed
  PostHash  common.Hash    // indexed
  Value     *big.Int
  Timestamp *big.Int
}

type UpvoteEvent struct {
  Actor   string // indexed
  BoardId   string // indexed
  PostHash  string // indexed
  Value     feed_attributes.Vote
  Timestamp feed_attributes.BlockTimestamp
}

func (postEventResult *PostEventResult) ToPostEvent() *PostEvent {
  return &PostEvent {
    Actor: postEventResult.Poster.String(),
    BoardId: postEventResult.BoardId.String(),
    ParentHash: postEventResult.ParentHash.String(),
    PostHash: postEventResult.PostHash.String(),
    FeedType: feed_attributes.CreateFeedTypeFromHashStr(common.Bytes2Hex(postEventResult.TypeHash[:])),
    Timestamp: feed_attributes.CreateBlockTimestampFromBigInt(postEventResult.Timestamp),
  }
}

func (upvoteEventResult *UpvoteEventResult) ToUpvoteEvent() *UpvoteEvent{
  return &UpvoteEvent {
    Actor:   upvoteEventResult.Actor.String(),
    BoardId:   upvoteEventResult.BoardId.String(),
    PostHash:  upvoteEventResult.PostHash.String(),
    Value:     feed_attributes.Vote(upvoteEventResult.Value.Int64()),
    Timestamp: feed_attributes.CreateBlockTimestampFromBigInt(upvoteEventResult.Timestamp),
  }
}
