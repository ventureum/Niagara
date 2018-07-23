package feed_item

import "feed/feed_attributes"


type EvaluationItem struct {
  ObjectId string `json:"objectId"`
  EvaluatorAddress string `json:"evaluatorAddress"`
  BoardId string `json:"boardId"`
  Timestamp feed_attributes.BlockTimestamp `json:"timestamp"`
  Value feed_attributes.Vote `json:"value"`
}
