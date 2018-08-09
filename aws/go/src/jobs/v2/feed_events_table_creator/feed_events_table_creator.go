package main

import (
  "feed/postgres_config/client_config"
  "feed/postgres_config/reputations_refuel_record_config"
  "feed/postgres_config/post_config"
  "feed/postgres_config/post_votes_record_config"
  "feed/postgres_config/post_rewards_record_config"
  "feed/postgres_config/post_reputations_record_config"
  "feed/postgres_config/post_replies_record_config"
  "feed/postgres_config/actor_reputations_record_config"
)

func main () {

  db := client_config.ConnectPostgresClient()

  postVotesRecordExecutor := post_votes_record_config.PostVotesRecordExecutor{*db}
  postVotesRecordExecutor.LoadVoteTypeEnum()
  postVotesRecordExecutor.DeletePostVotesRecordTable()
  postVotesRecordExecutor.CreatePostVotesRecordTable()

  reputationsRefuelRecordExecutor := reputations_refuel_record_config.ReputationsRefuelRecordExecutor{*db}
  reputationsRefuelRecordExecutor.LoadUuidExtension()
  reputationsRefuelRecordExecutor.DeleteReputationsRefuelRecordTable()
  reputationsRefuelRecordExecutor.CreateReputationsRefuelRecordTable()

  postRewardsRecordExecutor := post_rewards_record_config.PostRewardsRecordExecutor{*db}
  postRewardsRecordExecutor.DeletePostRewardsRecordTable()
  postRewardsRecordExecutor.CreatePostRewardsRecordTable()

  postReputationsRecordExecutor := post_reputations_record_config.PostReputationsRecordExecutor{*db}
  postReputationsRecordExecutor.LoadVoteTypeEnum()
  postReputationsRecordExecutor.DeletePostReputationsRecordTable()
  postReputationsRecordExecutor.CreatePostReputationsRecordTable()

  postRepliesRecordExecutor := post_replies_record_config.PostRepliesRecordExecutor{*db}
  postRepliesRecordExecutor.DeletePostRepliesRecordTable()
  postRepliesRecordExecutor.CreatePostRepliesRecordTable()

  postExecutor := post_config.PostExecutor{*db}
  postExecutor.DeletePostTable()
  postExecutor.CreatePostTable()

  actorReputationsRecordExecutor := actor_reputations_record_config.ActorReputationsRecordExecutor{*db}
  actorReputationsRecordExecutor.DeleteActorReputationsRecordTable()
  actorReputationsRecordExecutor.CreateActorReputationsRecordTable()
}
