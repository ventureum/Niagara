package main

import (
  "feed/feed_attributes"
  "log"
  "feed/feed_events"
  "math/big"
  "fmt"
)

func main () {
  dynamodbFeedClient := feed_events.CreateDynamodbFeedClient()
  dynamodbFeedClient.DeleteFeedEventsTable()
  dynamodbFeedClient.CreateFeedEventsTable()

  bigNumber1 := new(big.Int)
  bigNumber1.Exp(big.NewInt(2), big.NewInt(10), nil)
  log.Printf(bigNumber1.String())

  bigNumber2 := new(big.Int)
  bigNumber2.Exp(big.NewInt(2), big.NewInt(9), nil)

  actor1 := feed_attributes.Actor("davidhhshao")
  verb1 := feed_attributes.SubmitVerb
  object1 := feed_attributes.CreateObjectFromValue("post:0x01")
  time1 :=  feed_attributes.BlockTimestamp("1000000")
  rewards1 := feed_attributes.CreateRewardFromBigInt(bigNumber1)
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
  rewards2 := feed_attributes.CreateRewardFromBigInt(bigNumber2)
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

  feedId1 := feed_attributes.CreateFeedIdFromValue("user:davidhhshao")
  feedId2 := feed_attributes.CreateFeedIdFromValue("comment:0x01")
  feedId3 := feed_attributes.CreateFeedIdFromValue("board:all")
  feedId4 := feed_attributes.CreateFeedIdFromValue("board:x01")
  feedId5 := feed_attributes.CreateFeedIdFromValue("board:x02")

  getStreamClient := feed_events.ConnectGetStreamClient()

  flatFeed1 := getStreamClient.CreateFlatFeedFromFeedId(feedId1)
  flatFeed2 :=getStreamClient.CreateFlatFeedFromFeedId(feedId2)
  flatFeed3 :=getStreamClient.CreateFlatFeedFromFeedId(feedId3)
  flatFeed4 :=getStreamClient.CreateFlatFeedFromFeedId(feedId4)
  flatFeed5 :=getStreamClient.CreateFlatFeedFromFeedId(feedId5)
  flatFeed1.Follow(flatFeed3)
  flatFeed1.Follow(flatFeed4)
  flatFeed2.Follow(flatFeed3)
  flatFeed2.Follow(flatFeed5)
  flatFeed1.Unfollow(flatFeed3)
  flatFeed1.Unfollow(flatFeed4)


  fmt.Println(flatFeed1.GetFollowers())
  getStreamClient.AddFeedActivityToGetStream(postActivity1)
  getStreamClient.GetAllFeedActivitiesByFlatFeed(flatFeed1)
  getStreamClient.GetAllFeedActivitiesByFeedId(feedId1)
  getStreamClient.AddFeedActivityToGetStream(postActivity2)
  getStreamClient.AddFeedActivityToGetStream(commentActivity1)
  getStreamClient.GetAllFeedActivitiesByFeedId(feedId1)
  getStreamClient.GetAllFeedActivitiesByFeedId(feedId2)
  getStreamClient.GetAllFeedActivitiesByFeedId(feedId3)
  getStreamClient.GetAllFeedActivitiesByFeedId(feedId4)
  getStreamClient.GetAllFeedActivitiesByFeedId(feedId5)


  item := feed_events.CreateItemForFeedActivity(postActivity1)

  dynamodbFeedClient.AddItemIntoFeedEvents(item)
  expectedRewards := dynamodbFeedClient.ReadRewardsFromFeedEvents(object1.ObjId)
  log.Printf("expected rewards: %s\n", expectedRewards)

  item = dynamodbFeedClient.ReadItemFromFeedEvents(object1.ObjId)
  log.Println(item.Activity.Rewards)
  log.Printf("expected item: %+v\n",(*item))

  rewards2 = feed_attributes.CreateRewardFromBigInt(bigNumber2)
  item = dynamodbFeedClient.UpdateItemForFeedEventsWithRewards(object1.ObjId, rewards2)
  log.Println(item.Activity.Rewards)
  log.Printf("expected item: %+v\n",(*item))
}
