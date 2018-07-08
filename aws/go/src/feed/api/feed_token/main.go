package main

import (
  "gopkg.in/GetStream/stream-go2.v1"
  "strings"
  "crypto/sha1"
  "crypto/hmac"
  "encoding/base64"
  "github.com/aws/aws-lambda-go/lambda"
  "os"
)

type Request struct {
  FeedSlug string `json:"feedSlug,required"`
  UserId string `json:"userId,required"`
  GetStreamApiKey string `json:"getStreamApiKey,omitEmpty"`
  GetStreamApiSecret string `json:"getStreamApiSecret,omitEmpty"`
}

type Response struct {
  FeedToken string `json:"feedToken"`
  Ok bool `json:"ok"`
}

func urlSafe(src string) string {
  src = strings.Replace(src, "+", "-", -1)
  src = strings.Replace(src, "/", "_", -1)
  src = strings.Trim(src, "=")
  return src
}

func feedToken(feedID string, apiSecret string) string {
  id := strings.Replace(feedID, ":", "", -1)
  hash := sha1.New()
  hash.Write([]byte(apiSecret))
  mac := hmac.New(sha1.New, hash.Sum(nil))
  mac.Write([]byte(id))
  digest := base64.StdEncoding.EncodeToString(mac.Sum(nil))
  return urlSafe(digest)
}

func Handler(request Request) (Response, error) {
  var client *stream.Client
  var err error
  if request.GetStreamApiKey != "" && request.GetStreamApiSecret != "" {
    client, err = stream.NewClient(request.GetStreamApiKey, request.GetStreamApiSecret)
  } else {
    client, err = stream.NewClientFromEnv()
    request.GetStreamApiSecret = os.Getenv("STREAM_API_SECRET")
    request.GetStreamApiKey = os.Getenv("STREAM_API_KEY")
  }

  response := Response {
    FeedToken: "",
    Ok: false,
  }
  if err != nil {
    return response, err
  }
  client.FlatFeed(request.FeedSlug, request.UserId)
  feedID := request.FeedSlug + ":" + request.UserId
  response.FeedToken = feedToken(feedID, request.GetStreamApiSecret)
  response.Ok = true
  return response, nil
}

func main() {
  lambda.Start(Handler)
}
