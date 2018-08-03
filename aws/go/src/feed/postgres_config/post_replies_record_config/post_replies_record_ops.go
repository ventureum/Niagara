package post_replies_record_config

import (
  "feed/postgres_config/client_config"
  "log"
)


type PostRepliesRecordExecutor struct {
  client_config.PostgresFeedClient
}

func (postRepliesRecordExecutor *PostRepliesRecordExecutor) CreatePostRepliesRecordTable( ) {
  postRepliesRecordExecutor.CreateTimestampTrigger()
  postRepliesRecordExecutor.CreateTable(TABLE_SCHEMA_FOR_POST_REPLIES_RECORD, TABLE_NAME_FOR_POST_REPLIES_RECORD)
  postRepliesRecordExecutor.RegisterTimestampTrigger(TABLE_NAME_FOR_POST_REPLIES_RECORD)
}

func (postRepliesRecordExecutor *PostRepliesRecordExecutor) DeletePostRepliesRecordTable() {
  postRepliesRecordExecutor.DeleteTable(TABLE_NAME_FOR_POST_REPLIES_RECORD)
}

func (postRepliesRecordExecutor *PostRepliesRecordExecutor) UpsertPostRepliesRecord(postRepliesRecord *PostRepliesRecord) {
  _, err := postRepliesRecordExecutor.C.NamedExec(UPSERT_POST_REPLIES_RECORD_COMMAND, postRepliesRecord)
  if err != nil {
    log.Fatalf("Failed to upsert post replies record: %+v with error:\n %+v", postRepliesRecord, err.Error())
  }
  log.Printf("Sucessfully upserted post replies record for postHash %s\n", postRepliesRecord.PostHash)
}

func (postRepliesRecordExecutor *PostRepliesRecordExecutor) DeletePostRepliesRecords(postHash string) {
  _, err := postRepliesRecordExecutor.C.Exec(DELETE_POST_REPLIES_RECORD_COMMAND, postHash)
  if err != nil {
    log.Fatalf("Failed to delete post replies records for postHash %s with error:\n %+v", postHash, err.Error())
  }
  log.Printf("Sucessfully deleted post replies records for postHash %s\n", postHash)
}

func (postRepliesRecordExecutor *PostRepliesRecordExecutor) GetPostReplies(postHash string) *[]string {
  var postReplies []string
  err := postRepliesRecordExecutor.C.Select(&postReplies, QUERY_POST_REPLIES_COMMAND, postHash)
  if err != nil {
    log.Fatalf("Failed to get post repliers for postHash %s with error:\n %+v", postHash, err.Error())
  }
  return &postReplies
}

func (postRepliesRecordExecutor *PostRepliesRecordExecutor) GetPostRepliesRecordCount(postHash string) int64 {
  var updateCount int64
  err := postRepliesRecordExecutor.C.Get(&updateCount, QUERY_POST_REPLIES_COUNT_COMMAND, postHash)
  if err != nil {
    log.Fatalf("Failed to read post repliers count for postHash %s with error:\n %+v", postHash, err.Error())
  }
  return updateCount
}