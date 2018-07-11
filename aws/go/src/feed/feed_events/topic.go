package feed_events

import (
  "github.com/ethereum/go-ethereum/common"
  "github.com/ethereum/go-ethereum/crypto"
)

var PostEventTopic common.Hash = crypto.Keccak256Hash([]byte("Post(address,bytes32,bytes32,bytes32,bytes32,uint256)"))

var UpdatePostEventTopic common.Hash = crypto.Keccak256Hash([]byte("UpdatePost(address,bytes32,bytes32,uint256)"))

var UpvoteEventTopic common.Hash = crypto.Keccak256Hash([]byte("Upvote(address,bytes32,bytes32,uint256,uint256)"))
