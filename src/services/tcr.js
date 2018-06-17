import WalletUtils from '../utils/wallet'
import { BigNumber } from 'bignumber.js'
import { getTCR } from '../config'
import { store } from '../boot/configureStore'

class TCRService {
  constructor () {
    this.address = null
    this.tcr = null
  }

  async init () {
    this.tcr = await getTCR(WalletUtils.getWallet().walletAddress)
    this.address = this.tcr.address
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

    const firstHash = await this.tcr[methodMap[name]].call()
    const projectList = await this.getProjectList(methodMap[name], firstHash)
    return projectList
  }

  async getProjectList (type, curr) {
    var hashList = [curr]
    var next = curr
    var num
    do {
      next = await this.tcr.getNextProjectHash.call(type, next)
      num = new BigNumber(next.substring(2), 16)
    } while (!num.eq(new BigNumber('0')) && hashList.push(next))
    return hashList
  }
}

export default new TCRService()
