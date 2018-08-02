package client_config

const TRIGGER_SET_TIMESTAMP_COMMAND = `
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`

const REGISTER_TIMESTAMP_TRIGGER_COMMAND = `
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON %s
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
`
