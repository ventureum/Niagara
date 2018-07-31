package feed_item

import "feed/feed_attributes"


type EvaluationItem struct {
  UUID      UUID                           `json:"uuid"`
  PostHash  string                         `json:"postHash"`
  Evaluator string                         `json:"evaluator"`
  BoardId   string                         `json:"boardId"`
  Timestamp feed_attributes.BlockTimestamp `json:"timestamp"`
  Value     feed_attributes.Vote           `json:"value"`
}

func CreateUUIDForEvaluationItem (postHash string, evaluator string) UUID {
  return CreateUUIDFromArray([]string{postHash, evaluator})
}
