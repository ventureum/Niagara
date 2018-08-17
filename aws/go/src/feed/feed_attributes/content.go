package feed_attributes

import (
  "encoding/json"
  "log"
  "github.com/jmoiron/sqlx/types"
)

type Content struct {
  Title string `json:"title,omitempty"`
  Text string `json:"text,omitempty"`
  Subtitle string `json:"subtitle,omitempty"`
  Image string `json:"image,omitempty"`
}

func (content *Content) ToJsonText() types.JSONText {
  marshaled, err := json.Marshal(content)
  if err != nil {
    log.Panicf("Failed to marshal Content %+v with error: %+v\n", content, err)
  }
  return types.JSONText(string(marshaled))
}

func CreatedContentFromToJsonText(jsonText types.JSONText) *Content{
  var content Content
  err := jsonText.Unmarshal(&content)
  if err != nil {
    log.Panicf("Failed to unmarshal jsonText %+v with error: %+v\n", jsonText, err)
  }
  return &content
}
