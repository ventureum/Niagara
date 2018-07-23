package feed_attributes

import "math/big"

type Vote string

func (vote Vote) ToBigInt() *big.Int {
  num := new(big.Int)
  num.SetString(string(vote), 10)
  return num
}

func CreateVoteFromBigInt(bigInt *big.Int) Vote {
  return Vote(bigInt.String())
}

func (vote Vote) AddToBigInt(bigInt *big.Int) Vote {
  num := new(big.Int)
  num.Add(vote.ToBigInt(), bigInt)
  return Vote(num.String())
}

func (vote Vote) AddToVote(voteToAdd Vote) Vote {
  num := new(big.Int)
  num.Add(vote.ToBigInt(), voteToAdd.ToBigInt())
  return Vote(num.String())
}
