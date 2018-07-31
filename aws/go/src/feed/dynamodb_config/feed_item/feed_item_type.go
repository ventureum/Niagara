package feed_item

import "reflect"

type FeedItemType reflect.Type

var PostItemType FeedItemType = reflect.TypeOf(PostItem{})
var ProfileItemType FeedItemType = reflect.TypeOf(ProfileItem{})
var EvaluationItemType FeedItemType = reflect.TypeOf(EvaluationItem{})
var ExchangeRequestItemType FeedItemType = reflect.TypeOf(ExchangeRequestItem{})
var ReputationRecordItemType FeedItemType = reflect.TypeOf(ReputationRecordItem{})
var UpvoteCountItemType FeedItemType = reflect.TypeOf(UpvoteCountItem{})
