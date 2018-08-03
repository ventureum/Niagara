package post_rewards_record_config


const TABLE_SCHEMA_FOR_POST_REWARDS_RECORD = `
CREATE TABLE post_rewards_records (
    post_hash TEXT NOT NULL,
    rewards BIGINT NOT NULL DEFAULT 0 check(rewards >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (post_hash)
);
`

const TABLE_NAME_FOR_POST_REWARDS_RECORD = "post_rewards_records"