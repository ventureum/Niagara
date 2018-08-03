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
    log.Fatal("Failed to marshal Content %+v", content)
  }
  return types.JSONText(string(marshaled))
}

func CreatedContantFromToJsonText(jsonText types.JSONText) *Content{
  var content Content
  err := jsonText.Unmarshal(&content)
  if err != nil {
    log.Fatal("Failed to unmarshal jsonText %+v", jsonText)
  }
  return &content
}
