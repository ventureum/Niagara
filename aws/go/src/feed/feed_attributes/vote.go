package feed_attributes

import "log"

type Vote int64

const UP_VOTE Vote = 1
const DOWN_VOTE Vote = -1

func ValidateAndCreateVote(voteValue int64) Vote {
  if !ValidateVote(voteValue) {
    log.Fatalf("Invalid Vote value: %d", voteValue)
  }
  return Vote(voteValue)
}

func ValidateVote(voteValue int64) bool {
  vote := Vote(voteValue)
  if vote != UP_VOTE && vote != DOWN_VOTE {
    return false
  }
  return true
}
