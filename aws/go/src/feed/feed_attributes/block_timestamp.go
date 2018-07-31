package feed_attributes

import (
  "math/big"
  "time"
)

type BlockTimestamp int64


func CreateBlockTimestampFromBigInt(bigInt *big.Int) BlockTimestamp {
  return BlockTimestamp(bigInt.Int64())
}

func CreateBlockTimestampFromNow() BlockTimestamp {
  return BlockTimestamp(time.Now().Unix())
}
