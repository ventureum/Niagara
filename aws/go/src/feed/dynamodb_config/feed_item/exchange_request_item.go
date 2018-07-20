package feed_item

import "feed/feed_attributes"


type ExchangeRequestItem struct {
  Address string `json:"address"`
  Timestamp feed_attributes.BlockTimestamp `json:"timestamp"`
  Values []feed_attributes.Reputation `json:"values"`
}
