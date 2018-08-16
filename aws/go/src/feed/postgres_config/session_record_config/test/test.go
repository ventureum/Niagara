package main

import (
  "feed/postgres_config/client_config"
  "feed/postgres_config/session_record_config"
  "feed/feed_attributes"
  "log"
  "time"
)

func main() {
  db := client_config.ConnectPostgresClient()
  defer db.Close()

  postExecutor := session_record_config.SessionRecordExecutor{*db}
  postExecutor.DeleteSessionRecordTable()
  postExecutor.CreateSessionRecordTable()
  content := &feed_attributes.Content{
    Title: "titleSample1",
    Text: "hello, worl007d",
    Subtitle: "subtitleSample1",
  }

  sessionRecord1 := &session_record_config.SessionRecord{
    Actor:      "0xactor1",
    PostHash:   "0xpostHash002",
    StartTime:  time.Now().Unix(),
    EndTime:    time.Now().Add(time.Hour).Unix(),
    Content:    content.ToJsonText(),
  }

  sessionRecord2 := &session_record_config.SessionRecord{
    Actor:      "0xactor1",
    PostHash:   "0xpostHash002",
    StartTime:  time.Now().Unix(),
    EndTime:    time.Now().Add(time.Hour).Unix(),
    Content:    content.ToJsonText(),
  }

  postExecutor.UpsertSessionRecord(sessionRecord1)
  postExecutor.UpsertSessionRecord(sessionRecord2)

  sessionRecordRes1 := postExecutor.GetSessionRecord(sessionRecord1.PostHash)
  log.Printf("%+v\n", sessionRecordRes1.ToSessionRecordResult())


  sessionRecordRes2 := postExecutor.GetSessionRecord(sessionRecord2.PostHash)
  log.Printf("%+v\n", sessionRecordRes2.ToSessionRecordResult())

  postExecutor.DeleteSessionRecord(sessionRecord2.PostHash)
  sessionRecordRes2 = postExecutor.GetSessionRecord(sessionRecord2.PostHash)
  log.Printf("%+v\n", sessionRecordRes2.ToSessionRecordResult())
}
