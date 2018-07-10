package feed_attributes

import "math/big"

type BlockTimestamp string


func CreateBlockTimestampFromBigInt(bigInt *big.Int) BlockTimestamp {
  return BlockTimestamp(bigInt.String())
}

func (blockTimestamp BlockTimestamp) ToBigInt() *big.Int {
  num := new(big.Int)
  num.SetString(string(blockTimestamp), 10)
  return num
}
