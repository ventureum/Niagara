package post_rewards_record_config

import (
  "feed/postgres_config/client_config"
  "log"
  "feed/feed_attributes"
)


type PostRewardsRecordExecutor struct {
  client_config.PostgresFeedClient
}

func (postRewardsRecordExecutor *PostRewardsRecordExecutor) CreatePostRewardsRecordTable( ) {
  postRewardsRecordExecutor.CreateTimestampTrigger()
  postRewardsRecordExecutor.CreateTable(TABLE_SCHEMA_FOR_POST_REWARDS_RECORD, TABLE_NAME_FOR_POST_REWARDS_RECORD)
  postRewardsRecordExecutor.RegisterTimestampTrigger(TABLE_NAME_FOR_POST_REWARDS_RECORD)
}

func (postRewardsRecordExecutor *PostRewardsRecordExecutor) DeletePostRewardsRecordTable() {
  postRewardsRecordExecutor.DeleteTable(TABLE_NAME_FOR_POST_REWARDS_RECORD)
}

func (postRewardsRecordExecutor *PostRewardsRecordExecutor) UpsertPostRewardsRecord(postRewardsRecord *PostRewardsRecord) {
  _, err := postRewardsRecordExecutor.C.NamedExec(UPSERT_POST_REWARDS_RECORD_COMMAND, postRewardsRecord)
  if err != nil {
    log.Fatalf("Failed to upsert post rewards record: %+v with error:\n %+v", postRewardsRecord, err.Error())
  }
  log.Printf("Sucessfully upserted post rewards record for postHash %s\n", postRewardsRecord.PostHash)
}

func (postRewardsRecordExecutor *PostRewardsRecordExecutor) DeletePostRewardsRecords(postHash string) {
  _, err := postRewardsRecordExecutor.C.Exec(DELETE_POST_REWARDS_RECORD_COMMAND, postHash)
  if err != nil {
    log.Fatalf("Failed to delete post rewards records for postHash %s with error:\n %+v", postHash, err.Error())
  }
  log.Printf("Sucessfully deleted post rewards records for postHash %s\n", postHash)
}

func (postRewardsRecordExecutor *PostRewardsRecordExecutor) GetPostRewards(postHash string) feed_attributes.Reputation {
  var postRewards feed_attributes.Reputation
  err := postRewardsRecordExecutor.C.Get(&postRewards , QUERY_POST_REWARDS_COMMAND, postHash)
  if err != nil {
    log.Fatalf("Failed to get post rewards for postHash %s with error:\n %+v", postHash, err.Error())
  }
  return postRewards
}

func (postRewardsRecordExecutor *PostRewardsRecordExecutor) AddPostRewards(
    postHash string, reputationToAdd feed_attributes.Reputation) {
  _, err := postRewardsRecordExecutor.C.Exec(ADD_POST_REWARDS_COMMAND, postHash, reputationToAdd)

  if err != nil {
    log.Fatalf("Failed to add post rewards for postHash %s with error:\n %+v", postHash, err.Error())
  }

  log.Printf("Successfully added post rewards %d for postHash %s", reputationToAdd, postHash)
}


func (postRewardsRecordExecutor *PostRewardsRecordExecutor) SubPostRewards(
    postHash string, reputationToSub feed_attributes.Reputation) {
  _, err := postRewardsRecordExecutor.C.Exec(SUB_POST_REWARDS_COMMAND, postHash, reputationToSub)

  if err != nil {
    log.Fatalf("Failed to add post rewards for postHash %s with error:\n %+v", postHash, err.Error())
  }

  log.Printf("Successfully substracted post rewards %d from postHash %s", reputationToSub, postHash)
}
