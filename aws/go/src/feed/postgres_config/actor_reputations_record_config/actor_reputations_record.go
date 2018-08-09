package actor_reputations_record_config

import (
  "feed/feed_attributes"
  "time"
)

type ActorReputationsRecord struct {
  Actor string  `db:"actor"`
  Reputations feed_attributes.Reputation `db:"reputations"`
  CreatedAt time.Time `db:"created_at"`
  UpdatedAt time.Time `db:"updated_at"`
}
