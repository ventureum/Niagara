package main

import (
  "os"
  "log"
  "feed/feed_events"
  "feed/dynamodb_config/client_config"
)

func main() {
  forumAddress := os.Getenv("FORUM_ADDRESS")

  if forumAddress == "" {
   log.Fatal("forum address is not set yet")
  }

  log.Printf("Get Forum Address: %s\n", forumAddress)

  log.Println("Connecting to Ethereum EthClient")
  ethClient := feed_events.ConnectEthClient()

  log.Println("Connecting to GetStream Client")
  getStreamClient := feed_events.ConnectGetStreamClient()

  log.Println("Connecting to Dynamodb Client")
  dynamodbClient := client_config.CreateDynamodbFeedClient()

  log.Printf("Subscribing to logs at Forum Address: %s\n", forumAddress)
  ethClient.SubscribeFilterLogs(forumAddress, getStreamClient, dynamodbClient)
}
