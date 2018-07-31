package feed_item

import "strings"

type UUID string

func CreateUUIDFromArray( arr[]string) UUID {
  return UUID(strings.Join(arr[:],":"))
}

func (uuid UUID) Value() string {
  return string(uuid)
}
