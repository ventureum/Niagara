import {
  NonceTxMiddleware, SignedTxMiddleware, Client, LocalAddress, LoomProvider, createJSONRPCClient, CryptoUtils
} from 'loom-js'
import Web3 from 'web3'
import RepSys from './contracts/RepSys.json'
import Milestone from './contracts/Milestone.json'
import { store } from '../boot/configureStore'
import Config from 'react-native-config'

function getClient (privateKey, publicKey) {
  const writer = createJSONRPCClient({ protocols: [{ url: `http://${Config.REACT_APP_LOOM_ENDPOINT}:46658/rpc` }] })
  const reader = createJSONRPCClient({ protocols: [{ url: `http://${Config.REACT_APP_LOOM_ENDPOINT}:46658/query` }] })
  const client = new Client(
    'default',
    writer,
    reader
  )

  client.txMiddleware = [
    new NonceTxMiddleware(publicKey, client),
    new SignedTxMiddleware(privateKey)
  ]

  return client
}

class Contract {
  constructor () {
    this._getCurrentNetwork().then(network => { this.networkId = network })
  }

  async createClient (privateKey) {
    privateKey = new Uint8Array(Web3.utils.hexToBytes(privateKey))
    let publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    this.from = LocalAddress.fromPublicKey(publicKey).toString()
    this.client = getClient(privateKey, publicKey)
    this.web3 = new Web3(new LoomProvider(this.client, privateKey))
    this.user = this.from
    this.client.on('error', msg => {
      console.error('Error on connect to client', msg)
      console.warn('Please verify if loom command is running')
      this.disconnect()
      throw msg
    })
  }

  async disconnect () {
    await this.client.disconnect()
  }

  _getCurrentNetwork () {
    return Promise.resolve('default')
  }

  createContractInstance () {
    this.RepSysCurrentNetwork = RepSys.networks[this.networkId]
    this.MilestoneCurrentNetwork = Milestone.networks[this.networkId]

    if (!this.RepSysCurrentNetwork || !this.MilestoneCurrentNetwork) {
      throw Error('Contract not deployed on Loom')
    }

    const RepSysABI = RepSys.abi
    const MilestoneABI = Milestone.abi
    this.repSysInstance = new this.web3.eth.Contract(RepSysABI, this.RepSysCurrentNetwork.address, {
      from: this.user
    })
    this.milestoneInstance = new this.web3.eth.Contract(MilestoneABI, this.MilestoneCurrentNetwork.address, {
      from: this.user
    })
  }

  start (privateKey) {
    this.createClient(privateKey)
    this.createContractInstance()
  }

  // RepSys functions
  async registerUser (uuid, user, userType, reputation = 0, meta) {
    await this.repSysInstance.methods.registerUser(
      uuid,
      user,
      userType,
      reputation,
      meta).send()
  }

  async delegate (projectId, actor, pct) {
    return this.repSysInstance.methods.delegate(
      projectId,
      actor,
      pct).send()
  }

  // milestone functions
  async rateObj (projectId, milestoneId, ratings, comment) {
    return this.milestoneInstance.methods.rateObj(projectId, milestoneId, ratings, comment).send()
  }

  async activateMilestone (projectId, milestoneId) {
    return this.milestoneInstance.methods.activateMilestone(projectId, milestoneId).send()
  }

  async finalizeMilestone (projectId, milestoneId) {
    return this.milestoneInstance.methods.finalizeMilestone(projectId, milestoneId).send()
  }

  async removeMilestone (projectId, milestoneId) {
    return this.milestoneInstance.methods.removeMilestone(projectId, milestoneId).send()
  }

  async modifyMilestone (projectId, milestoneId, content, objData) {
    return this.milestoneInstance.methods.modifyMilestone(projectId, milestoneId, content, objData.objMetaCompact, objData.objContent).send()
  }

  async addMilestone (projectId, content, objData) {
    return this.milestoneInstance.methods.addMilestone(projectId, content, objData.objMetaCompact, objData.objContent).send()
  }
}

let handler = {
  get: (target, name) => {
    let needInstanceList = [
      'delegate',
      'rateObj',
      'activateMilestone',
      'finalizeMilestone',
      'removeMilestone',
      'modifyMilestone',
      'addMilestone'
    ]
    if (needInstanceList.indexOf(name) >= 0) {
      let state = store.getState()
      if (state.userReducer.profile && state.userReducer.profile.privateKey) {
        target.start(state.userReducer.profile.privateKey)
      } else {
        console.error('No privateKey')
      }
      return async (...args) => {
        let result = await target[name](...args)
        target.disconnect()
        return result
      }
    } else {
      return target[name]
    }
  }
}

export default new Proxy(new Contract(), handler)
