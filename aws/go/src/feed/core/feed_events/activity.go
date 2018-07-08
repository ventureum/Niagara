package main

type Actor string
type Verb string
type Blocknumber uint64
type ActivityType string

const (
  SubmitVerb Verb = "submit"
  ReplyVerb Verb = "reply"
  UpvoteVerb Verb = "upvote"
)

const (
  ReplyActivityType  ActivityType = "reply"
  PostActivityType ActivityType = "post"
)

type Object struct{
  Prefix ActivityType
  Hash string
}

func (obj Object) Value() string {
  return string(obj.Prefix) + ":" + obj.Hash
}

type Activity interface {}

type PostActivity struct {
  actor Actor
  verb Verb
  object Object
  foreign_id Object
  time Blocknumber
  rewards  float64
  to []string
}

type CommentActivity struct {
  actor Actor
  verb Verb
  object Object
  foreign_id Object
  post Object
  time Blocknumber
  to []string
}

type FeedRecord map[Object]Activity
