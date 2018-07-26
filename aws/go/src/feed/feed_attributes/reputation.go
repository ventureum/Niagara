package feed_attributes

import (
  "math/big"
)

type Reputation string

const PostReputationCost Reputation = "10"
const ReplyReputationCost Reputation = "1"
const AduitReputationCost Reputation = "100"


func InitReputationsFromFeedType(feedType FeedType) Reputation {
  reputations := Reputation("0")
  switch feedType {
    case PostFeedType:
      reputations = reputations.SubReputations(PostReputationCost)
    case ReplyFeedType:
      reputations = reputations.SubReputations(ReplyReputationCost)
    case AuditFeedType:
      reputations = reputations.SubReputations(AduitReputationCost)
  }
  return reputations
}

func PenaltyForFeedType(feedType FeedType, counter int64) Reputation {
  var reputations Reputation
  switch feedType {
    case PostFeedType:
        reputations = PostReputationCost.MulByPower(big.NewInt(2), big.NewInt(counter))
    case ReplyFeedType:
        reputations = ReplyReputationCost.MulByPower(big.NewInt(2), big.NewInt(counter))
    case AuditFeedType:
        reputations = AduitReputationCost.MulByPower(big.NewInt(2), big.NewInt(counter))
  }
  return reputations
}

func PenaltyForUpvote(base Reputation, counter int64) Reputation {
  return base.MulByPower(big.NewInt(2), big.NewInt(counter))
}

func BigFloatToReputation(f *big.Float) Reputation {
  return Reputation(f.Text('G', 38))
}

func (reputation Reputation) Value() string{
  return string(reputation)
}

func (reputation Reputation) ToBigInt() *big.Int {
  num := new(big.Int)
  num.SetString(string(reputation), 10)
  return num
}

func (reputation Reputation) ToBigFloat() *big.Float {
  f, _ := new(big.Float).SetString(reputation.Value())
  return f
}

func CreateReputationFromBigInt(bigInt *big.Int) Reputation {
  return CreateReputationFromString(bigInt.String())
}

func CreateReputationFromString(value string) Reputation {
  f, _ := new(big.Float).SetString(value)
  return BigFloatToReputation(f)
}

func (reputation Reputation) AddToBigInt(bigInt *big.Int) Reputation {
  num := new(big.Float)
  f, _ := new(big.Float).SetString(bigInt.String())
  num.Add(reputation.ToBigFloat(), f)
  return BigFloatToReputation(f)
}

func (reputation Reputation) AddToReputations(reputationToAdd Reputation) Reputation {
  num := new(big.Float)
  num.Add(reputation.ToBigFloat(), reputationToAdd.ToBigFloat())
  return BigFloatToReputation(num)
}

func (reputation Reputation) SubReputations(reputationToSub Reputation) Reputation {
  num := new(big.Float)
  num.Sub(reputation.ToBigFloat(), reputationToSub.ToBigFloat())
  return BigFloatToReputation(num)
}

func (reputation Reputation) MulByPower(base *big.Int, factor *big.Int) Reputation {
  num := new(big.Float)
  numInt := new(big.Int).Exp(base, factor, nil )
  numFloat, _ := new(big.Float).SetString(numInt.String())
  num.Mul(reputation.ToBigFloat(), numFloat)

  return BigFloatToReputation(num)
}

func (reputation Reputation) Sign() int {
  num := reputation.ToBigFloat()
  return num.Sign()
}

func (reputation Reputation) Abs() string {
  num := new(big.Float)
  return num.Abs(reputation.ToBigFloat()).String()
}

func (reputation Reputation) Neg() Reputation {
  num := new(big.Float)
  return BigFloatToReputation(num.Neg(reputation.ToBigFloat()))
}
