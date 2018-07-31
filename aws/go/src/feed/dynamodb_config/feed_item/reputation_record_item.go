package feed_item

import "feed/feed_attributes"


type ReputationRecordItem struct {
  UserAddress  string                        `json:"userAddress"`
  Reputations feed_attributes.Reputation     `json:"reputations"`
}
