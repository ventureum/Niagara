package post_config

import (
  "feed/postgres_config/client_config"
  "log"
)


type PostExecutor struct {
  client_config.PostgresFeedClient
}

func (postExecutor *PostExecutor) CreatePostTable( ) {
  postExecutor.CreateTimestampTrigger()
  postExecutor.CreateTable(TABLE_SCHEMA_FOR_POST, TABLE_NAME_FOR_POST)
  postExecutor.RegisterTimestampTrigger(TABLE_NAME_FOR_POST)
}

func (postExecutor *PostExecutor) DeletePostTable() {
   postExecutor.DeleteTable(TABLE_NAME_FOR_POST)
}

func (postExecutor *PostExecutor) UpsertPostRecord(postRecord *PostRecord) {
  _, err := postExecutor.C.NamedExec(UPSERT_POST_COMMAND, postRecord)
  if err != nil {
    log.Fatalf("Failed to upsert post record: %+v with error:\n %+v", postRecord, err.Error())
  }
  log.Printf("Sucessfully upserted post record for postHash %s\n", postRecord.PostHash)
}

func (postExecutor *PostExecutor) DeletePostRecord(postHash string) {
  _, err := postExecutor.C.Exec(DELETE_POST_COMMAND, postHash)
  if err != nil {
    log.Fatalf("Failed to delete post record for postHash %s with error:\n %+v", postHash, err.Error())
  }
  log.Printf("Sucessfully deleted post record for postHash %s\n", postHash)
}

func (postExecutor *PostExecutor) GetPostRecord(postHash string) *PostRecord {
  var postRecord PostRecord
  err := postExecutor.C.Get(&postRecord, QUERY_POST_COMMAND, postHash)
  if err != nil {
    log.Fatalf("Failed to get post record for postHash %s with error:\n %+v", postHash, err.Error())
  }
  return &postRecord
}

func (postExecutor *PostExecutor) GetPostUpdateCount(postHash string) int64 {
  var updateCount int64
  err := postExecutor.C.Get(&updateCount, QUERY_POST_UPDATE_COUNT_COMMAND, postHash)
  if err != nil {
    log.Fatalf("Failed to get post update count for postHash %s with error:\n %+v", postHash, err.Error())
  }
  return updateCount
}