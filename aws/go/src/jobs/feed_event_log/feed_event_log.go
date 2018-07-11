package main

import (
  "os"
  "log"
  "feed/feed_events"
)


func main() {
  forumAddress := os.Getenv("FORUM_ADDRESS")

  if forumAddress == "" {
     log.Fatal("forum address is not set yet")
  }

  log.Printf("Get Forum Address: %s\n", forumAddress)

  log.Println("Connecting to Ethereum EthClient")
  client := feed_events.ConnectEthClient()

  log.Printf("Subscribing to logs at Forum Address: %s\n", forumAddress)
  client.SubscribeFilterLogs(forumAddress)
}
