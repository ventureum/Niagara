package profile_config

import (
  "feed/dynamodb_config/feed_item"
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
  "feed/dynamodb_config/client_config"
)


type ProfileExecutor struct {
  client_config.DynamodbFeedClient
}


func (profileExecutor *ProfileExecutor) CreateProfileTable( ) {
  profileExecutor.CreateTable(
    AttributeDefinitionsForProfile,
    KeySchemaForProfile,
    ProvisionedThroughputForProfile,
    TableNameForProfile,
  )
}

func (profileExecutor *ProfileExecutor) DeleteProfileTable() {
  profileExecutor.DeleteTable(TableNameForProfile)
}

func (profileExecutor *ProfileExecutor) AddProfileItem(profileItem *feed_item.ProfileItem) {
  var feedItem feed_item.FeedItem = *profileItem
  profileExecutor.AddItem(&feedItem, TableNameForProfile, "")
}

func (profileExecutor *ProfileExecutor) DeleteProfileItem(userAddress string) {
  key := map[string]*dynamodb.AttributeValue{
    "userAddress": {
      S: aws.String(userAddress),
    },
  }
  profileExecutor.DeleteItem(key, TableNameForProfile, feed_item.ProfileItemType)
}

func (profileExecutor *ProfileExecutor) ReadProfileItem(userAddress string) *feed_item.ProfileItem {
  key := map[string]*dynamodb.AttributeValue{
    "userAddress": {
      S: aws.String(userAddress),
    },
  }
  item := profileExecutor.ReadItem(key, TableNameForProfile, feed_item.ProfileItemType)
  profileItem := (*item).(feed_item.ProfileItem)
  return &profileItem
}
