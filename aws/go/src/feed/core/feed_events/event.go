package main

import (
  "github.com/ethereum/go-ethereum/common"
  "math/big"
)

type Event struct {
  event interface{}
}

func NewEvent(e interface{}) (*Event) {
  return &Event{e}
}

type PostEventResult struct {
  Poster common.Address  // indexed
  BoardId common.Hash    // indexed
  ParentHash common.Hash
  PostHash common.Hash  // indexed
  IpfsPath common.Hash
}

type PostEvent struct {
  Poster string // indexed
  BoardId string    // indexed
  ParentHash string
  PostHash string  // indexed
  IpfsPath string
}

type UpdatePostEventResult struct {
  Poster common.Address  // indexed
  PostHash common.Hash   // indexed
  IpfsPath common.Hash
}

type UpdatePostEvent struct {
  Poster string  // indexed
  PostHash string   // indexed
  IpfsPath string
}

type UpvoteEventResult struct {
  Poster common.Address // indexed
  BoardId common.Hash   // indexed
  Value *big.Int
}

type UpvoteEvent struct {
  Poster string // indexed
  BoardId string   // indexed
  Value uint64
}

func (postEventResult *PostEventResult) ToPostEvent() *PostEvent {
  return &PostEvent {
    Poster: postEventResult.Poster.String(),
    BoardId: postEventResult.BoardId.String(),
    ParentHash: postEventResult.ParentHash.String(),
    PostHash: postEventResult.PostHash.String(),
    IpfsPath: postEventResult.IpfsPath.String(),
  }
}

func (updatePostEventResult *UpdatePostEventResult) ToUpdatePostEvent() *UpdatePostEvent {
  return &UpdatePostEvent {
    Poster: updatePostEventResult.Poster.String(),
    PostHash: updatePostEventResult.PostHash.String(),
    IpfsPath: updatePostEventResult.IpfsPath.String(),
  }
}

func (upvoteEventResult *UpvoteEventResult) ToUpvoteEvent() *UpvoteEvent{
  return &UpvoteEvent {
    Poster: upvoteEventResult.Poster.String(),
    BoardId: upvoteEventResult.BoardId.String(),
    Value: upvoteEventResult.Value.Uint64(),
  }
}
