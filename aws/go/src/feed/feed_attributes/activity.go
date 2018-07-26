package feed_attributes


type Activity struct {
  Actor       Actor                  `json:"actor"`
  Verb        Verb                   `json:"verb"`
  Object      Object                 `json:"object"`
  ForeignId   Object                 `json:"foreignId"`
  Time        BlockTimestamp         `json:"time"`
  FeedType    FeedType               `json:"feedType"`
  To          []FeedId               `json:"to"`
  Extra       map[string]interface{} `json:"extra"`
}

func CreateNewActivity(
    actor Actor,
    verb Verb,
    obj Object,
    time BlockTimestamp,
    feedType FeedType,
    to []FeedId,
    extraParam map[string]interface{}) *Activity {

  return &Activity{
          Actor:       actor,
          Verb:        verb,
          Object:      obj,
          ForeignId:   obj,
          Time:        time,
          FeedType:    feedType,
          To:          to,
          Extra:       extraParam,
  }
}
