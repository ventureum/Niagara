package feed_attributes

import "github.com/ethereum/go-ethereum/crypto"
import "github.com/ethereum/go-ethereum/common"

type TypeHash string

const (
  PostTypeHash TypeHash = "POST"
  CommentTypeHash TypeHash = "COMMENT"
  AuditTypeHash TypeHash = "AUDIT"
  AirdropTypeHash TypeHash = "AIRDROP"
)

func (typeHash TypeHash) Hash() string {
  bytes4Hash := crypto.Keccak256Hash([]byte(typeHash.Value())).Bytes()[:4]
  return common.Bytes2Hex(bytes4Hash)
}

func (typeHash TypeHash) Value() string {
  return string(typeHash)
}

func CreateFromHashStr(typeHashStr string) TypeHash {
  var typeHash TypeHash
  switch typeHashStr {
    case PostTypeHash.Hash():
      typeHash = PostTypeHash
    case CommentTypeHash.Hash():
      typeHash = CommentTypeHash
    case AuditTypeHash.Hash():
      typeHash = AuditTypeHash
    case AirdropTypeHash.Hash():
      typeHash = AirdropTypeHash
  }
  return typeHash
}
