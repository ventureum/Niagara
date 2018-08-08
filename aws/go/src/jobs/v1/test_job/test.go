package main

import (
  "feed/dynamodb_config/client_config"
  "feed/dynamodb_config/post_config"
  "feed/dynamodb_config/profile_config"
  "feed/dynamodb_config/evaluation_config"
  "feed/dynamodb_config/exchange_request_config"
  "math/big"
  "log"
  "feed/feed_attributes"
  "feed/dynamodb_config/feed_item"
)

func main () {
  /*
    Create Post table
   */
  dynamodbFeedClient := client_config.CreateDynamodbFeedClient()
  postExecutor := post_config.PostExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  postExecutor.DeletePostTable()
  postExecutor.CreatePostTable()

  /*
    Create Profile table
  */
  profileExecutor := profile_config.ProfileExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  profileExecutor.DeleteProfileTable()
  profileExecutor.CreateProfileTable()

  /*
    Create Evaluation table
  */

  evaluationExecutor := evaluation_config.EvaluationExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  evaluationExecutor.DeleteEvaluationTable()
  evaluationExecutor.CreateEvaluationTable()

  /*
    Create ExchangeRequest table
  */
  exchangeRequestExecutor := exchange_request_config.ExchangeRequestExecutor{DynamodbFeedClient: *dynamodbFeedClient}
  exchangeRequestExecutor.DeleteExchangeRequestTable()
  exchangeRequestExecutor.CreateExchangeRequestTable()

  /*
    Create activities
  */
  bigNumber1 := new(big.Int)
  bigNumber1.Exp(big.NewInt(2), big.NewInt(10), nil)

  bigNumber2 := new(big.Int)
  bigNumber2.Exp(big.NewInt(2), big.NewInt(9), nil)

  actor1 := feed_attributes.Actor("davidhhshao")
  verb1 := feed_attributes.SubmitVerb
  object1 := feed_attributes.CreateObjectFromValue("post:0x01")
  time1 :=  feed_attributes.BlockTimestamp("1000000")
  rewards1 := feed_attributes.CreateReputationFromBigInt(bigNumber1)
  to1 := []feed_attributes.FeedId {
   feed_attributes.CreateFeedIdFromValue("board:all"),
   feed_attributes.CreateFeedIdFromValue("board:0x01"),
  }
  typeHash1 := feed_attributes.PostTypeHash
  postActivity1 := feed_attributes.CreateNewActivity(
   actor1, verb1, object1, time1, typeHash1, rewards1, to1, map[string]interface{}{})

  if postActivity1 == nil {
   log.Fatal("falied to create post activity 1")
  }

  actor2 := feed_attributes.Actor("0x01")
  verb2 := feed_attributes.SubmitVerb
  object2 := feed_attributes.CreateObjectFromValue("post:0x02")
  time2 :=  feed_attributes.BlockTimestamp("2000000")
  rewards2 := feed_attributes.CreateReputationFromBigInt(bigNumber2)
  to2 := []feed_attributes.FeedId {
   feed_attributes.CreateFeedIdFromValue("board:all"),
   feed_attributes.CreateFeedIdFromValue("board:0x02"),
  }
  typeHash2 := feed_attributes.PostTypeHash
  postActivity2 := feed_attributes.CreateNewActivity(
   actor2, verb2, object2, time2, typeHash2, rewards2, to2, map[string]interface{}{})

  if postActivity2 == nil {
   log.Fatal("falied to create post activity 2")
  }

  actor3 := feed_attributes.Actor("0x02")
  verb3 := feed_attributes.ReplyVerb
  object3 := feed_attributes.CreateObjectFromValue("reply:0x01")
  time3 := feed_attributes.BlockTimestamp("3000000")
  to3 := []feed_attributes.FeedId{
   feed_attributes.CreateFeedIdFromValue("comment:0x10022d8f528048ea7dc39fd660d2ac1f1c959560"),
  }
  typeHash3 := feed_attributes.CommentTypeHash
  post := feed_attributes.CreateObjectFromValue("post:0x02")
  extra := map[string]interface{}{
   "post": post,
  }

  commentActivity1 := feed_attributes.CreateNewActivity(actor3, verb3, object3, time3, typeHash3, rewards2, to3, extra)
  if  commentActivity1 == nil {
   log.Fatal("falied to create comment activity 1")
  }

  /*
    Post Item operations
  */
  item := feed_item.CreatePostItem(postActivity1)

  postExecutor.UpsertPostItem(item)
  expectedRewards :=  postExecutor.ReadRewards(object1.ObjId)
  log.Printf("expected rewards: %s\n", expectedRewards)

  postExecutor.UpdateRewards(object1.ObjId, rewards2)
  expectedRewards =  postExecutor.ReadRewards(object1.ObjId)
  log.Printf("expected rewards: %s\n", expectedRewards)

  readItem := postExecutor.ReadPostItem(object1.ObjId)
  log.Printf("expected postItem: %+v\n", readItem)

  postExecutor.DeletePostItem(object1.ObjId)
  readItem = postExecutor.ReadPostItem(object1.ObjId)
  log.Printf("expected postItem: %+v\n", readItem)
}
