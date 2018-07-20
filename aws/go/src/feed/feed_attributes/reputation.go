package feed_attributes

import "math/big"

type Reputation string

func (reputation Reputation) ToBigInt() *big.Int {
  num := new(big.Int)
  num.SetString(string(reputation), 10)
  return num
}

func CreateReputationFromBigInt(bigInt *big.Int) Reputation {
  return Reputation(bigInt.String())
}

func (reputation Reputation) AddToBigInt(bigInt *big.Int) Reputation {
  num := new(big.Int)
  num.Add(reputation.ToBigInt(), bigInt)
  return Reputation(num.String())
}

func (reputation Reputation) AddToReputation(reputationToAdd Reputation) Reputation {
  num := new(big.Int)
  num.Add(reputation.ToBigInt(), reputationToAdd.ToBigInt())
  return Reputation(num.String())
}
