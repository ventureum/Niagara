package feed_attributes


type Activity struct {
  Actor Actor `json:"actor"`
  Verb Verb `json:"verb"`
  Object Object  `json:"object"`
  ForeignId Object `json:"foreignId"`
  Time BlockTimestamp `json:"time"`
  TypeHash TypeHash `json:"typeHash"`
  Rewards Reward `json:"rewards"`
  To []FeedId `json:"to"`
  Extra map[string]interface{} `json:"extra"`
}

func CreateNewActivity(
    actor Actor,
    verb Verb,
    obj Object,
    time BlockTimestamp,
    typeHash TypeHash,
    rewards Reward,
    to []FeedId,
    extraParam map[string]interface{}) *Activity {

  return &Activity{
          Actor: actor,
          Verb: verb,
          Object: obj,
          ForeignId: obj,
          Time: time,
          TypeHash: typeHash,
          Rewards: rewards,
          To: to,
          Extra: extraParam,
  }
}
