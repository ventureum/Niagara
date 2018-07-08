package main

import (
   "os"
   "log"
)

func main() {
   forumAddress := os.Getenv("FORUM_ADDRESS")

   if forumAddress == "" {
      log.Fatal("forum address is not set yet")
   }

   log.Printf("Get Forum Address: %s\n", forumAddress)

   client := ConnectClient()

   log.Println("Connected to Ethereum Client")

   client.SubscribeFilterLogs(forumAddress)
}
