package feed_attributes

type Content struct {
  Title string `json:"title"`
  Text string `json:"text"`
  Subtitle string `json:"subtitle,omitEmpty"`
  Image string `json:"image,omitEmpty"`
}

