import WalletUtils from '../utils/wallet'
import { BigNumber } from 'bignumber.js'
import { store } from '../boot/configureStore'

class TCRService {
  constructor () {
    this.address = null
    this.tcr = null
    this.token = null
    this.account = null
  }

  async init () {
    this.account = WalletUtils.getWallet().walletAddress
    this.tcr = await WalletUtils.getContractInstance('Registry')
    this.token = await WalletUtils.getContractInstance('Token')
    this.address = this.tcr._address
    this.web3 = WalletUtils.getWeb3Instance()
  }

  toHex (val) {
    return this.web3.utils.asciiToHex(val)
  }

  setUpEvents () {
    this.tcr.allEvents()
      .watch((error, log) => {
        if (error) {
          console.error(error)
          return false
        }

        store.dispatch({
          type: 'TCR_EVENT'
        })
      })
  }

  async getList (name) {
    const methodMap = {
      'pending': 'PENDING_LIST',
      'whitelist': 'WHITELIST_LIST',
      'voting': 'VOTING_LIST'
    }
    var hashList = []
    var next = this.toHex(0)
    var num
    var type = await this.tcr.methods[methodMap[name]]().call()
    do {
      next = await this.tcr.methods.getNextProjectHash(type, next).call()
      num = new BigNumber(next.substring(2), 16)
    } while (!num.eq(new BigNumber('0')) && hashList.push(next))

    if (name === 'voting') {
      var votingList = []
      var obj
      for (let i = 0; i < hashList.length; i++) {
        obj = {
          hash: hashList[i]
        }
        obj.inProgress = await this.tcr.methods.voteInProgress(obj.hash).call()
        let poll = await this.tcr.methods.getPollVotes(obj.hash).call()
        obj.voteFor = new BigNumber(poll.voteFor)
        obj.voteAgainst = new BigNumber(poll.voteAgainst)
        if (obj.inProgress) {
          let time = await this.tcr.methods.getVoteStartingTimeAndEndingTime(obj.hash).call()
          obj.startingTime = time.startingTime
          obj.endingTime = time.endingTime
        } else {
          let MIN_VOTE_THRESHOLD = await this.tcr.methods.MIN_VOTE_THRESHOLD().call()
          if (obj.voteFor.plus(obj.voteAgainst).toNumber() >= MIN_VOTE_THRESHOLD && obj.voteFor.gt(obj.voteAgainst)) {
            obj.canBeWhitelisted = true
          } else {
            obj.canBeWhitelisted = false
          }
        }
        votingList.push(obj)
      }
      return votingList
    } else {
      return hashList
    }
  }

  async delist (item) {
    await this.tcr.methods.delist(item.hash).send()
  }

  async whitelist (item) {
    await this.tcr.methods.whitelist(item.hash).send()
  }

  async vote (hash, option, amount) {
    let data = this.tcr.methods.vote(this.account, hash, option, Number(amount)).encodeABI()
    await this.token.methods.approveAndCall(this.address, Number(amount), data).send()
  }
}

export default new TCRService()
