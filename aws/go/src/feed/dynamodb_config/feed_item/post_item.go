package feed_item

import (
  "feed/feed_attributes"
)


type PostItem struct {
  ObjectType string `json:"objectType"`
  ObjectId string `json:"objectId"`
  Activity feed_attributes.Activity `json:"activity"`
}


func CreatePostItem(activity *feed_attributes.Activity) *PostItem {
  return &PostItem {
    ObjectType: string(activity.Object.ObjType),
    ObjectId: activity.Object.ObjId,
    Activity: *activity,
  }
}

func (itemForPost *PostItem) GetObject() string {
  return itemForPost.ObjectType + ":" + itemForPost.ObjectId
}
