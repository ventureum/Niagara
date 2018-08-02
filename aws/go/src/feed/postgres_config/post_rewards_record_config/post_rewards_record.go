package post_rewards_record_config

import (
  "time"
  "feed/feed_attributes"
)


type PostRewardsRecord struct {
  PostHash string  `db:"post_hash"`
  Rewards feed_attributes.Reputation `db:"rewards"`
  CreatedAt time.Time `db:"created_at"`
  UpdatedAt time.Time `db:"updated_at"`
}
