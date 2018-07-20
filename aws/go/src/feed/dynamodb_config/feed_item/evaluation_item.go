package feed_item

import "feed/feed_attributes"


type EvaluationItem struct {
  ObjectType string `json:"objectType"`
  ObjectId string `json:"objectId"`
  EvaluatorAddress string `json:"evaluatorAddress"`
  Timestamp feed_attributes.BlockTimestamp `json:"timestamp"`
  Value int64 `json:"value"`
}
