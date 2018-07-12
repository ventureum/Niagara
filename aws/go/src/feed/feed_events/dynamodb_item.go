package feed_events

import (
  "feed/feed_attributes"
  "reflect"
)

type ItemForFeedActivity interface {}

type ItemForFeedPostActivity struct {
  Object string `json:"object"`
  Activity feed_attributes.PostActivity `json:"activity"`
}

type ItemForCommentActivity struct {
  Object string `json:"object"`
  Activity feed_attributes.CommentActivity `json:"activity"`
}

func CreateItemForFeedActivity(activity *feed_attributes.Activity) *ItemForFeedActivity {
  var itemForFeedActivity ItemForFeedActivity
  switch reflect.TypeOf(*activity) {
    case reflect.TypeOf(feed_attributes.PostActivity{}):
       postActivity := (*activity).(feed_attributes.PostActivity)
      itemForFeedActivity = ItemForFeedPostActivity{
         Object: postActivity.Object.Value(),
         Activity: postActivity,
       }
    case reflect.TypeOf(feed_attributes.CommentActivity{}):
      commentActivity := (*activity).(feed_attributes.CommentActivity)
      itemForFeedActivity = ItemForCommentActivity {
        Object: commentActivity.Object.Value(),
        Activity: commentActivity,
      }
    default:
      return nil
  }
  return &itemForFeedActivity
}

func InitFromObjectType(objType feed_attributes.ObjectType) ItemForFeedActivity {
  var itemForFeedActivity ItemForFeedActivity
  if objType == feed_attributes.CommentObjectType {
    itemForFeedActivity = ItemForCommentActivity{}
  }

  if objType == feed_attributes.PostObjectType {
    itemForFeedActivity = ItemForFeedPostActivity{}
  }
  return itemForFeedActivity
}

func GetObjectFromItemForFeedActivity(itemForFeedActivity *ItemForFeedActivity) feed_attributes.Object {
    var obj feed_attributes.Object
    switch reflect.TypeOf(*itemForFeedActivity) {
      case reflect.TypeOf(ItemForFeedPostActivity{}):
        obj = (*itemForFeedActivity).(ItemForFeedPostActivity).Activity.Object
      case reflect.TypeOf(ItemForCommentActivity{}):
        obj = (*itemForFeedActivity).(ItemForCommentActivity).Activity.Object
    }
    return obj
}

func GetRewardsFromItemForFeedActivity(itemForFeedActivity *ItemForFeedActivity) feed_attributes.Reward {
  if reflect.TypeOf(*itemForFeedActivity) == reflect.TypeOf(ItemForFeedPostActivity{}) {
    return (*itemForFeedActivity).(ItemForFeedPostActivity).Activity.Rewards
  }
  return feed_attributes.Reward("0")
}
