package feed_events

import (
  "gopkg.in/GetStream/stream-go2.v1"
  "log"
  "feed/feed_attributes"
  "reflect"
  "time"
)

type GetStreamClient struct {
  c *stream.Client
}

func ConnectGetStreamClient() (*GetStreamClient) {
  client, err := stream.NewClientFromEnv()
  if err != nil {
    log.Println("Failed to connect to GetStreamClient")
    log.Fatal(err)
  }
  log.Println("Connected to GetStream Client")
  return &GetStreamClient{c:  client}
}

func (getStreamClient *GetStreamClient) CreateFlatFeed(feedSlug string, userId string) *stream.FlatFeed {
  return getStreamClient.c.FlatFeed(feedSlug, userId)
}

func (getStreamClient *GetStreamClient) CreateFlatFeedFromFeedId(feedId feed_attributes.FeedId) *stream.FlatFeed {
  return getStreamClient.c.FlatFeed(string(feedId.FeedSlug), string(feedId.UserId))
}

func (getStreamClient *GetStreamClient) AddFeedActivityToGetStream(activity *feed_attributes.Activity) {
  switch reflect.TypeOf(*activity) {
    case reflect.TypeOf(feed_attributes.PostActivity{}):
      postActivity := (*activity).(feed_attributes.PostActivity)
      actor := string(postActivity.Actor)
      verb := string(postActivity.Verb)
      obj := postActivity.Object.Value()
      timestamp := postActivity.Time
      streamActivity := stream.Activity{
        Actor: actor,
        Verb: verb,
        Object: obj,
        Time: stream.Time{
          Time: time.Unix(timestamp.ToInt64(), 0),
        },
        ForeignID: obj,
        To: feed_attributes.ConvertToStringArray(postActivity.To),
        Extra: map[string]interface{}{
          "rewards": postActivity.Rewards,
        },
      }

      flatFeed := getStreamClient.CreateFlatFeed(string(feed_attributes.UserFeedSlug), actor)
      flatFeed.AddActivities(streamActivity)
      log.Printf("Added feed activity to GetStream with object: %s by user %s with stream activty: %v+\n", obj, actor, streamActivity)

    case reflect.TypeOf(feed_attributes.CommentActivity{}):
      commentActivity := (*activity).(feed_attributes.CommentActivity)
      actor := string(commentActivity.Actor)
      verb := string(commentActivity.Verb)
      obj := commentActivity.Object.Value()
      timestamp := commentActivity.Time
      streamActivity := stream.Activity{
        Actor: actor,
        Verb: verb,
        Object: obj,
        Time: stream.Time{
          Time: time.Unix(timestamp.ToInt64(), 0).UTC(),
        },
        ForeignID: obj,
        To: feed_attributes.ConvertToStringArray(commentActivity.To),
        Extra: map[string]interface{}{
          "post": commentActivity.Post.Value(),
        },
      }

      flatFeed := getStreamClient.CreateFlatFeed(string(feed_attributes.UserFeedSlug), actor)
      flatFeed.AddActivities(streamActivity)
      log.Printf("Added feed activity to GetStream with object: %s by user %s with stream activty: %v+\n", obj, actor, streamActivity)
  }
}

func (getStreamClient *GetStreamClient) GetAllFeedActivitiesByFeedId(feedId feed_attributes.FeedId) {
  flatFeed := getStreamClient.c.FlatFeed(string(feedId.FeedSlug), string(feedId.UserId))
  flatFeedResponse, err := flatFeed.GetActivities(stream.WithActivitiesLimit(10))
  if err != nil {
   log.Printf("Failed to get activities for feedId: %s\n", feedId.Value())
   log.Fatal(err.Error())
  }
  log.Printf("%+v\n",flatFeedResponse.Results)
}

func (getStreamClient *GetStreamClient) GetAllFeedActivitiesByFlatFeed(flatFeed *stream.FlatFeed) {
  flatFeedResponse, err := flatFeed.GetActivities()
  if err != nil {
    log.Printf("Failed to get activities for feedId: %s\n", flatFeed.ID())
    log.Fatal(err.Error())
  }
  log.Printf("Activities for Feed Id %s\n %+v\n",flatFeed.ID(), flatFeedResponse.Results)
}
