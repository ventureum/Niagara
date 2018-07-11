package main

import (
  "feed/feed_events"
)


func main () {
  dynamodbFeedClient := feed_events.CreateDynamodbFeedClient()
  dynamodbFeedClient.DeleteFeedEventsTable()
  dynamodbFeedClient.CreateFeedEventsTable()
}
