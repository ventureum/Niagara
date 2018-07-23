package feed_item

import (
  "feed/feed_attributes"
)


type PostItem struct {
  ObjectId string `json:"objectId"`
  Activity feed_attributes.Activity `json:"activity"`
}


func CreatePostItem(activity *feed_attributes.Activity) *PostItem {
  return &PostItem {
    ObjectId: activity.Object.ObjId,
    Activity: *activity,
  }
}

func (itemForPost *PostItem) GetObject() string {
  return string(itemForPost.Activity.Object.ObjType) + ":" + itemForPost.ObjectId
}
