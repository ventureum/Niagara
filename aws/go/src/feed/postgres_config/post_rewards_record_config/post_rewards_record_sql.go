package post_rewards_record_config


const UPSERT_POST_REWARDS_RECORD_COMMAND = `
INSERT INTO post_rewards_records
(
  post_hash,
  rewards
)
VALUES 
(
  :post_hash, 
  :rewards
)
ON CONFLICT (post_hash) 
DO
 UPDATE
    SET rewards = :rewards
    WHERE post_rewards_records.post_hash = :post_hash;
`

const DELETE_POST_REWARDS_RECORD_COMMAND = `
DELETE FROM post_rewards_records
WHERE post_hash = $1;
`

const QUERY_POST_REWARDS_COMMAND = `
SELECT rewards FROM post_rewards_records
WHERE post_hash = $1;
`

const QUERY_POST_REWARDS_FOR_UPDATE_COMMAND = `
SELECT rewards FROM post_rewards_records
WHERE post_hash = $1 FOR UPDATE;
`

const ADD_POST_REWARDS_COMMAND = `
 UPDATE post_rewards_records
    SET rewards = post_rewards_records.rewards + $2
    WHERE post_hash = $1;
`

const SUB_POST_REWARDS_COMMAND = `
 UPDATE post_rewards_records
    SET rewards = post_rewards_records.rewards - $2
    WHERE post_hash = $1;
`
