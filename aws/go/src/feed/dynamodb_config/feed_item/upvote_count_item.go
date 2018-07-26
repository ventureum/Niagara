package feed_item

type UpvoteCountItem struct {
  PostHash  string                         `json:"postHash"`
  Evaluator string                         `json:"evaluator"`
  VoteCount int64                          `json:"voteCount"`
}
