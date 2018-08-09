package main

import (
  "feed/postgres_config/client_config"
  "log"
  "feed/postgres_config/post_reputations_record_config"
  "feed/feed_attributes"
)


func main() {
  db := client_config.ConnectPostgresClient()
  postReputationsRecordExecutor := post_reputations_record_config.PostReputationsRecordExecutor{*db}
  postReputationsRecordExecutor.LoadVoteTypeEnum()
  postReputationsRecordExecutor.DeletePostReputationsRecordTable()
  postReputationsRecordExecutor.CreatePostReputationsRecordTable()

  actorOne := "0x01"
  actorTwo := "0x02"
  postHashOne := "0xpostHash001"
  postHashTwo := "0xpostHash002"
  postHashThree := "0xpostHash003"

  postReputationsRecord1 := &post_reputations_record_config.PostReputationsRecord{
    Actor: actorOne,
    PostHash: postHashOne,
    Reputations: feed_attributes.Reputation(100),
    LatestVoteType: feed_attributes.DOWN_VOTE_TYPE,
  }

  postReputationsRecord2 := &post_reputations_record_config.PostReputationsRecord{
    Actor: actorOne,
    PostHash: postHashTwo,
    Reputations: feed_attributes.Reputation(50),
    LatestVoteType: feed_attributes.DOWN_VOTE_TYPE,
  }

  postReputationsRecord3 := &post_reputations_record_config.PostReputationsRecord{
    Actor: actorTwo,
    PostHash: postHashOne,
    Reputations: feed_attributes.Reputation(500),
    LatestVoteType: feed_attributes.UP_VOTE_TYPE,
  }

  postReputationsRecord4 := &post_reputations_record_config.PostReputationsRecord{
    Actor: actorTwo,
    PostHash: postHashTwo,
    Reputations: feed_attributes.Reputation(400),
    LatestVoteType: feed_attributes.UP_VOTE_TYPE,
  }

  postReputationsRecord5 := &post_reputations_record_config.PostReputationsRecord{
    Actor: actorTwo,
    PostHash: postHashTwo,
    Reputations: feed_attributes.Reputation(600),
    LatestVoteType: feed_attributes.DOWN_VOTE_TYPE,
  }

  postReputationsRecordExecutor.UpsertPostReputationsRecord(postReputationsRecord1)
  postReputationsRecordExecutor.UpsertPostReputationsRecord(postReputationsRecord2)
  postReputationsRecordExecutor.UpsertPostReputationsRecord(postReputationsRecord3)
  postReputationsRecordExecutor.UpsertPostReputationsRecord(postReputationsRecord4)
  postReputationsRecordExecutor.UpsertPostReputationsRecord(postReputationsRecord5)
  postReputationsRecordExecutor.UpsertPostReputationsRecord(postReputationsRecord3)


  reputationsForPostHashOneAndActorOne := postReputationsRecordExecutor.GetReputationsByPostHashAndActor(
     postHashOne, actorOne)
  log.Printf("total reputations for postHash %s and actor %s: %+v\n",
     postHashOne, actorOne, reputationsForPostHashOneAndActorOne)

  reputationsForPostHashOneAndActorTwo := postReputationsRecordExecutor.GetReputationsByPostHashAndActor(
    postHashOne, actorTwo)
  log.Printf("total reputations for postHash %s and actor %s: %+v\n",
    postHashOne, actorTwo, reputationsForPostHashOneAndActorTwo)


  reputationsForPostHashTwoAndActorOne := postReputationsRecordExecutor.GetReputationsByPostHashAndActor(
    postHashTwo, actorOne)
  log.Printf("total reputations for postHash %s and actor %s: %+v\n",
    postHashTwo, actorOne, reputationsForPostHashTwoAndActorOne)

  reputationsForPostHashTwoAndActorTwo := postReputationsRecordExecutor.GetReputationsByPostHashAndActor(
    postHashTwo, actorTwo)
  log.Printf("total reputations for postHash %s and actor %s: %+v\n",
    postHashTwo, actorTwo, reputationsForPostHashTwoAndActorTwo)

  totalReputationsForPostHashOne := postReputationsRecordExecutor.GetTotalReputationsByPostHash(postHashOne)
  log.Printf("total reputations for postHash %s: %+v\n", postHashOne, totalReputationsForPostHashOne)

  totalReputationsForPostHashTwo := postReputationsRecordExecutor.GetTotalReputationsByPostHash(postHashTwo)
  log.Printf("total reputations for postHash %s: %+v\n", postHashTwo, totalReputationsForPostHashTwo)

  totalReputationsForPostHashOneAndUpVote := postReputationsRecordExecutor.GetReputationsByPostHashAndVoteType(
    postHashOne, feed_attributes.UP_VOTE_TYPE)
  log.Printf("total reputations for postHash %s and voteType %s: %+v\n",
    postHashOne, feed_attributes.UP_VOTE_TYPE, totalReputationsForPostHashOneAndUpVote)

  totalReputationsForPostHashOneAndDownVote := postReputationsRecordExecutor.GetReputationsByPostHashAndVoteType(
    postHashOne, feed_attributes.DOWN_VOTE_TYPE)
  log.Printf("total reputations for postHash %s and voteType %s: %+v\n",
    postHashOne, feed_attributes.DOWN_VOTE_TYPE, totalReputationsForPostHashOneAndDownVote)

  totalReputationsForPostHashTwoAndUpVote := postReputationsRecordExecutor.GetReputationsByPostHashAndVoteType(
    postHashTwo,  feed_attributes.UP_VOTE_TYPE)
  log.Printf("total reputations for postHash %s and voteType %s: %+v\n",
    postHashTwo, feed_attributes.UP_VOTE_TYPE, totalReputationsForPostHashTwoAndUpVote)

  totalReputationsForPostHashTwoAndDownVote := postReputationsRecordExecutor.GetReputationsByPostHashAndVoteType(
    postHashTwo, feed_attributes.DOWN_VOTE_TYPE)
  log.Printf("total reputations for postHash %s and voteType %s: %+v\n",
    postHashTwo, feed_attributes.DOWN_VOTE_TYPE, totalReputationsForPostHashTwoAndDownVote)

  totalReputationsForPostHashThreeAndUpVote := postReputationsRecordExecutor.GetReputationsByPostHashAndVoteType(
    postHashThree,  feed_attributes.UP_VOTE_TYPE)
  log.Printf("total reputations for postHash %s and voteType %s: %+v\n",
    postHashThree, feed_attributes.UP_VOTE_TYPE, totalReputationsForPostHashThreeAndUpVote)
}
