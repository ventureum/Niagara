package main

import (
  "os"
  "log"
  "feed/feed_events"
  "feed/postgres_config/client_config"
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

  log.Println("Connecting to Postgres Client")
  postgresClient := client_config.ConnectPostgresClient()

  log.Printf("Subscribing to logs at Forum Address: %s\n", forumAddress)
  ethClient.SubscribeFilterLogsV2(forumAddress, getStreamClient, postgresClient)
}
