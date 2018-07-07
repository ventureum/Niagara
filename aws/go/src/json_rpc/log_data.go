package json_rpc

type LogData struct {
  // TAG - true when the log was removed, due to a chain reorganization. false if its a valid log
  Removed           bool           `json:"removed"`

  // QUANTITY - integer of the log index position in the block. null when its pending log
  LogIndex          int64           `json:"logIndex"`

  // QUANTITY - integer of the transactions index position log was created from. null when its pending log
  TransactionIndex  int64           `json:"transactionIndex"`

  // DATA, 32 Bytes - hash of the transactions this log was created from. null when its pending log
  TransactionHash   string          `json:"transactionHash"`

  // DATA, 32 Bytes - hash of the block where this log was in. null when its pending. null when its pending log.
  BlockHash         string          `json:"blockHash"`

  // QUANTITY - the block number where this log was in. null when its pending. null when its pending log
  BlockNumber       int64           `json:"blockNumber"`

  // DATA, 20 Bytes - address from which this log originated
  Address           string          `json:"address"`

  // DATA - contains one or more 32 Bytes non-indexed arguments of the log.
  Data              interface{}     `json:"data"`

  // topics
  Topics            []string        `json:"topics"`
}
