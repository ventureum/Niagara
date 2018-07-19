package feed_events

import (
  "feed/feed_attributes"
)

type ItemForFeedActivity struct {
  ObjectType string `json:"objectType"`
  ObjectId string `json:"objectId"`
  Activity feed_attributes.Activity `json:"activity"`
}


func CreateItemForFeedActivity(activity *feed_attributes.Activity) *ItemForFeedActivity {
  return &ItemForFeedActivity {
    ObjectType: string(activity.Object.ObjType),
    ObjectId: activity.Object.ObjId,
    Activity: *activity,
  }
}

func (itemForFeedActivity *ItemForFeedActivity) GetObject() string {
  return itemForFeedActivity.ObjectType + ":" + itemForFeedActivity.ObjectId
}
