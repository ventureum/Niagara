package main

import (
  "feed/feed_attributes"
  "log"
  "feed/feed_events"
  "math/big"
)

func main () {
  dynamodbFeedClient := feed_events.CreateDynamodbFeedClient()
  //dynamodbFeedClient.DeleteFeedEventsTable()
  //dynamodbFeedClient.CreateFeedEventsTable()

  bigNumber1 := new(big.Int)
  bigNumber1.Exp(big.NewInt(2), big.NewInt(20), nil)
  log.Printf(bigNumber1.String())

  bigNumber2 := new(big.Int)
  bigNumber2.Exp(big.NewInt(2), big.NewInt(258), nil)

  actor1 := feed_attributes.Actor("0x2710490eccd09b395fe4deaf1db6af0821735783")
  verb1 := feed_attributes.SubmitVerb
  object1 := feed_attributes.CreateObjectFromValue("post:0xe0a22d8f528048ea7dc39fd660d2ac1f1c959560")
  time1 :=  feed_attributes.BlockTimestamp(bigNumber1.String())
  rewards1 := feed_attributes.CreateRewardFromBigInt(bigNumber1)
  to1 := []feed_attributes.FeedId {
    feed_attributes.CreateFeedIdFromValue("board:all"),
    feed_attributes.CreateFeedIdFromValue("board:0x2640de046bcf7a86bcae86e3276d711948670960"),
  }
  activity1 := feed_attributes.CreateNewActivity(actor1, verb1, object1, time1, to1, rewards1)
  if activity1 == nil {
    log.Fatal("falied to create activity")
  }
  item := feed_events.CreateItemForFeedActivity(activity1)
  dynamodbFeedClient.AddItemIntoFeedEvents(item)

  expectedRewards := dynamodbFeedClient.ReadRewardsFromFeedEvents(object1)
  log.Printf("expected rewards: %s\n", expectedRewards)

  item = dynamodbFeedClient.ReadItemFromFeedEvents(object1)
  log.Println(feed_events.GetRewardsFromItemForFeedActivity(item))
  log.Printf("expected item: %+v\n",(*item))

  rewards2 := feed_attributes.CreateRewardFromBigInt(bigNumber2)
  item = dynamodbFeedClient.UpdateItemForFeedEventsWithRewards(object1, rewards2)
  log.Println(feed_events.GetRewardsFromItemForFeedActivity(item))
  log.Printf("expected item: %+v\n",(*item))
}
