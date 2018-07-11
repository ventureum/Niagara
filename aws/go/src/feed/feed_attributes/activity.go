package feed_attributes

import (
  "reflect"
)


type Activity interface{}

type BaseActivity struct {
  Actor Actor `json:"actor"`
  Verb Verb `json:"verb"`
  Object Object  `json:"object"`
  ForeignId Object `json:"foreignId"`
  Time BlockTimestamp `json:"time"`
  To []FeedId `json:"to"`
}

type PostActivity struct {
  BaseActivity
  Rewards Reward `json:"rewards"`
}

type CommentActivity struct {
  BaseActivity
  Post Object `json:"post"`
}


func CreateNewActivity(
    actor Actor,
    verb Verb,
    obj Object,
    time BlockTimestamp,
    to []FeedId,
    extraParam interface{}) *Activity {
    var activity Activity
    if verb == SubmitVerb && reflect.TypeOf(extraParam) == reflect.TypeOf(Reward("10000")) {
      activity = PostActivity{
        BaseActivity: BaseActivity{
          Actor: actor,
          Verb: verb,
          Object: obj,
          ForeignId: obj,
          Time: time,
          To: to,
        },
        Rewards: extraParam.(Reward),
      }
    } else if verb == ReplyVerb && reflect.TypeOf(extraParam) == reflect.TypeOf(Object{}) {
      activity = CommentActivity{
        BaseActivity: BaseActivity{
          Actor: actor,
          Verb: verb,
          Object: obj,
          ForeignId: obj,
          Time: time,
          To: to,
        },
        Post: extraParam.(Object),
      }
    } else {
      return nil
    }
    return &activity
}
