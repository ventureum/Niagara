package main

import (
  "feed/feed_attributes"
  "feed/dynamodb_config/feed_item"
  "feed/postgres_config/client_config"
  "feed/postgres_config/actor_reputations_record_config"
  "feed/postgres_config/post_reputations_record_config"
  "feed/postgres_config/post_votes_record_config"
  "time"
  "log"
)

const STACK_FRACTION float64 = 0.01

type Request struct {
  Actor string `json:"actor,required"`
  BoardId string `json:"boardId,required"`
  PostHash string `json:"postHash,required"`
  Value int64 `json:"value,required"`
}

type Response struct {
  Ok      bool   `json:"ok"`
  Message string `json:"message,omitempty"`
}

func (request *Request) RequestToEvaluationItem() (*feed_item.EvaluationItem) {
  return &feed_item.EvaluationItem{
    UUID: feed_item.CreateUUIDForEvaluationItem(request.PostHash, request.Actor),
    PostHash:  request.PostHash,
    Evaluator: request.Actor,
    BoardId:   request.BoardId,
    Value:     feed_attributes.ValidateAndCreateVote(request.Value),
    Timestamp: feed_attributes.CreateBlockTimestampFromNow(),
  }
}

func Handler(request Request) (Response, error) {
  response := Response {
    Ok: false,
  }

  if !feed_attributes.ValidateVote(request.Value) {
    response.Message = "Invalid Value for Vote"
    return response, nil
  }

  actor := request.Actor
  postHash := request.PostHash
  var voteType feed_attributes.VoteType
  if request.Value < 0 {
    voteType = feed_attributes.DOWN_VOTE_TYPE
  } else {
    voteType = feed_attributes.UP_VOTE_TYPE
  }
  postgresFeedClient := client_config.ConnectPostgresClient()
  postgresFeedClient.Begin()

  actorReputationsRecordExecutor := actor_reputations_record_config.ActorReputationsRecordExecutor{
    *postgresFeedClient}
  postReputationsRecordExecutor := post_reputations_record_config.PostReputationsRecordExecutor{*postgresFeedClient}
  postVotesRecordExecutor := post_votes_record_config.PostVotesRecordExecutor{*postgresFeedClient}

  // CutOff Time
  cutOffTimeStamp := time.Now()

  // Actor List for PostHash and VoteType
  actorList := *postReputationsRecordExecutor.GetActorListByPostHashAndVoteTypeTx(postHash, voteType)

  log.Printf("Actor List for PostHash and VoteType: %+v\n", actorList)

  // Current Actor Reputation
  actorReputation := actorReputationsRecordExecutor.GetActorReputationsTx(actor)

  log.Printf("Current Actor Reputation: %+v\n", actorReputation)

  // Total Actor Reputations
  totalActorReputations := actorReputationsRecordExecutor.GetTotalActorReputationsTx()

  log.Printf("Total Actor Reputations: %+v\n", totalActorReputations)

  // Total Actor Reputations for PostHash
  totalReputationsForPostHash := postReputationsRecordExecutor.GetTotalReputationsByPostHashTx(postHash)


  log.Printf("Total Actor Reputations for PostHash: %+v\n", totalReputationsForPostHash)

  // Total Actor Reputations for PostHash with the same voteType as actor
  totalReputationsForPostHashWithSameVoteType := postReputationsRecordExecutor.GetReputationsByPostHashAndVoteTypeTx(
    postHash, voteType)

  log.Printf("Total Actor Reputations for PostHash with the same voteType as actor: %+v\n",  totalReputationsForPostHashWithSameVoteType)

  // Last Actor Reputation when doing vote
  lastActorReputation := postReputationsRecordExecutor.GetReputationsByPostHashAndActorTx(postHash, actor)

  log.Printf("Last Actor Reputation when doing vote: %+v\n", lastActorReputation)

  totalReputationsForPostHash  =  totalReputationsForPostHash - lastActorReputation + actorReputation
  totalReputationsForPostHashWithSameVoteType = totalReputationsForPostHashWithSameVoteType - lastActorReputation + actorReputation

  log.Printf("Updated  totalReputationsForPostHash: %+v\n",  totalReputationsForPostHash)
  log.Printf("Updated  totalReputationsForPostHashWithSameVoteType : %+v\n",  totalReputationsForPostHashWithSameVoteType)
  log.Printf("totalActorReputations : %+v\n",  totalActorReputations )

  // Calculate Vote Cost
  voteCost := STACK_FRACTION * float64(actorReputation)*
      (1.00 - float64(totalReputationsForPostHash) / float64(totalActorReputations))

  log.Printf("voteCost: %+v\n", voteCost)

  voteCount :=  postReputationsRecordExecutor.GetTotalVotesCountByPostHashAndActorType(postHash, actor)

  log.Printf("Vote Count: %+v\n", voteCount)

  votePenalty := feed_attributes.PenaltyForVote(feed_attributes.Reputation(voteCost), voteCount)

  log.Printf("vote Penalty : %+v\n", votePenalty)

  // Deduct  votePenalty
  actorReputationsRecordExecutor.SubActorReputationsTx(actor, votePenalty)

  // Record current vote
  postVotesRecord :=  post_votes_record_config.PostVotesRecord {
    Actor: actor,
    PostHash: postHash,
    VoteType: voteType,
  }
  postVotesRecordExecutor.UpsertPostVotesRecordTx(&postVotesRecord)

  // Update Actor Reputation For the postHash
  postReputationsRecord := post_reputations_record_config.PostReputationsRecord{
    Actor: actor,
    PostHash: postHash,
    Reputations: actorReputation.SubReputations(votePenalty),
    LatestVoteType: voteType,
  }
  postReputationsRecordExecutor.UpsertPostReputationsRecordTx(&postReputationsRecord)


  if totalReputationsForPostHashWithSameVoteType > 0 {
    // Distribute Rewards
    for _, actorAddress := range actorList {
      awardedActorReputation := postReputationsRecordExecutor.GetReputationsByPostHashAndActorWithLatestVoteTypeAndTimeCutOffTx(
        postHash, actorAddress, voteType, cutOffTimeStamp)
      rewards :=  int64(float64(votePenalty) * float64(awardedActorReputation) / float64(totalReputationsForPostHashWithSameVoteType))

      log.Printf(" rewards  %+v for actorAddress %s\n",  rewards , actorAddress)
      actorReputationsRecordExecutor.AddActorReputationsTx(actorAddress, feed_attributes.Reputation(rewards))
    }
  }

  postgresFeedClient.Commit()
  response.Ok = true
  return response, nil
}

func main() {
  // TODO(david.shao): remove example when deployed to production
  //request := Request{
  // Actor:  "0x001",
  // BoardId: "0x02",
  // PostHash: "0x009",
  // Value: -1,
  //}
  //Handler(request)

  lambda.Start(Handler)
}
