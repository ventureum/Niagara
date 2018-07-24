package feed_item

import (
  "feed/feed_attributes"
)


type PostItem struct {
  ObjectId string `json:"objectId"`
  Activity feed_attributes.Activity `json:"activity"`
  Voters []feed_attributes.Voter `json:"voters"`
}


func CreatePostItem(activity *feed_attributes.Activity) *PostItem {
  var voters []feed_attributes.Voter
  return &PostItem {
    ObjectId: activity.Object.ObjId,
    Activity: *activity,
    Voters: voters,
  }
}

func (itemForPost *PostItem) GetObject() string {
  return string(itemForPost.Activity.Object.ObjType) + ":" + itemForPost.ObjectId
}
