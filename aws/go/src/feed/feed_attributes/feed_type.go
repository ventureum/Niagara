package feed_attributes

import "github.com/ethereum/go-ethereum/crypto"
import "github.com/ethereum/go-ethereum/common"

type FeedType string

const (
  PostFeedType    FeedType = "POST"
  ReplyFeedType   FeedType = "COMMENT"
  AuditFeedType   FeedType = "AUDIT"
  AirdropFeedType FeedType = "AIRDROP"
)

func (feedType FeedType) Hash() string {
  bytes4Hash := crypto.Keccak256Hash([]byte(feedType.Value())).Bytes()[:4]
  return "0x" + common.Bytes2Hex(bytes4Hash)
}

func (feedType FeedType) Value() string {
  return string(feedType)
}

func CreateFeedTypeFromHashStr(typeHashStr string) FeedType {
  var feedType FeedType
  switch typeHashStr {
    case PostFeedType.Hash():
      feedType = PostFeedType
    case ReplyFeedType.Hash():
      feedType = ReplyFeedType
    case AuditFeedType.Hash():
      feedType = AuditFeedType
    case AirdropFeedType.Hash():
      feedType = AirdropFeedType
  }
  return feedType
}
