package exchange_request_config

import (
  "feed/dynamodb_config/feed_item"
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/aws"
  "feed/dynamodb_config/client_config"
)

type ExchangeRequestExecutor struct {
  client_config.DynamodbFeedClient
}


func (exchangeRequestExecutor *ExchangeRequestExecutor) CreateExchangeRequestTable( ) {
  exchangeRequestExecutor.CreateTable(
    AttributeDefinitionsForExchangeRequest,
    KeySchemaForExchangeRequest,
    ProvisionedThroughputForExchangeRequest,
    TableNameForExchangeRequest,
  )
}

func (exchangeRequestExecutor *ExchangeRequestExecutor) DeleteExchangeRequestTable() {
  exchangeRequestExecutor.DeleteTable(TableNameForExchangeRequest)
}

func (exchangeRequestExecutor *ExchangeRequestExecutor) AddExchangeRequestItem(exchangeRequestItem *feed_item.ExchangeRequestItem) {
  var feedItem feed_item.FeedItem = *exchangeRequestItem
  exchangeRequestExecutor.AddItem(&feedItem, TableNameForExchangeRequest, "")
}

func (exchangeRequestExecutor *ExchangeRequestExecutor) DeleteExchangeRequestItem(address string) {
  key := map[string]*dynamodb.AttributeValue{
    "address": {
      S: aws.String(address),
    },
  }
  exchangeRequestExecutor.DeleteItem(key, TableNameForExchangeRequest, feed_item.ExchangeRequestItemType)
}

func (exchangeRequestExecutor *ExchangeRequestExecutor) ReadExchangeRequestItem(address string) *feed_item.ExchangeRequestItem {
  key := map[string]*dynamodb.AttributeValue{
    "address": {
      S: aws.String(address),
    },
  }
  item := exchangeRequestExecutor.ReadItem(key, TableNameForExchangeRequest, feed_item.ExchangeRequestItemType)
  exchangeRequestItem := (*item).(feed_item.ExchangeRequestItem)
  return &exchangeRequestItem
}
