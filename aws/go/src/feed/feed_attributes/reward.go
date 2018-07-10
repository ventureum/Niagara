package feed_attributes

import "math/big"

type Reward string

func (reward Reward) ToBigInt() *big.Int {
  num := new(big.Int)
  num.SetString(string(reward), 10)
  return num
}

func CreateRewardFromBigInt(bigInt *big.Int) Reward {
  return Reward(bigInt.String())
}

func (reward Reward) AddToBigInt(bigInt *big.Int) Reward {
  num := new(big.Int)
  num.Add(reward.ToBigInt(), bigInt)
  return Reward(num.String())
}

func (reward Reward) AddToReward(rewardToAdd Reward) Reward {
  num := new(big.Int)
  num.Add(reward.ToBigInt(), rewardToAdd.ToBigInt())
  return Reward(num.String())
}
