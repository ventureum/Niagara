package json_rpc

import (
  "strconv"
  "fmt"
  "encoding/json"
)

type LogResult struct {
  // TAG - true when the log was removed, due to a chain reorganization. false if its a valid log
  Removed            bool           `json:"removed"`

  // QUANTITY - integer of the log index position in the block. null when its pending log
  LogIndex           string         `json:"logIndex"`

  // QUANTITY - integer of the transactions index position log was created from. null when its pending log
  TransactionIndex   string          `json:"transactionIndex"`

  // DATA, 32 Bytes - hash of the transactions this log was created from. null when its pending log
  TransactionHash     string          `json:"transactionHash"`

  // DATA, 32 Bytes - hash of the block where this log was in. null when its pending. null when its pending log.
  BlockHash           string          `json:"blockHash"`

  // QUANTITY - the block number where this log was in. null when its pending. null when its pending log
  BlockNumber         string          `json:"blockNumber"`

  // DATA, 20 Bytes - address from which this log originated
  Address             string           `json:"address"`

  // DATA - contains one or more 32 Bytes non-indexed arguments of the log.
  Data                interface{}       `json:"data"`

  // topics
  Topics              []string          `json:"topics"`
}

// ToLog converts a LogResult to a LogData
func (logResult *LogResult) ToLog() (*LogData, error) {
  // string-to-integer conversions
  logIndex, err := strconv.ParseInt(logResult.LogIndex, 0, 64)
  if err != nil {
    return nil, fmt.Errorf("ToLog LogIndex: %v", err)
  }

  transactionIndex, err := strconv.ParseInt(logResult.TransactionIndex, 0, 64)
  if err != nil {
    return nil, fmt.Errorf("ToLog TransactionIndex: %v", err)
  }

  blockNumber, err := strconv.ParseInt(logResult.BlockNumber, 0, 64)
  if err != nil {
    return nil, fmt.Errorf("ToLog BlockNumber: %v", err)
  }

  log := LogData {
    Removed: logResult.Removed,
    LogIndex: logIndex,
    TransactionIndex: transactionIndex,
    TransactionHash: logResult.TransactionHash,
    BlockHash: logResult.BlockHash,
    BlockNumber: blockNumber,
    Address: logResult.Address,
    Data: logResult.Data,
    Topics: logResult.Topics,
  }

  return &log, nil
}

// ToJSON marshals a BlockResult into JSON
func (logResult *LogResult) ToJSON() ([]byte, error) {
  s, err := json.Marshal(logResult)
  if err != nil {
    return nil, err
  }
  return s, nil
}
