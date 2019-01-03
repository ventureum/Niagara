import Config from 'react-native-config'
import WalletUtils from '../utils/wallet'
import axios from 'axios'
import bs58 from 'bs58'
import initials from 'initials'
import { store } from '../boot/configureStore.js'
import delay from 'delay'
import contract from '../utils/contract'
import { CryptoUtils, LocalAddress } from 'loom-js'

const shake128 = require('js-sha3').shake128

const stream = require('getstream')
const client = stream.connect(Config.STREAM_API_KEY, null, Config.STREAM_APP_ID)
const GAS_PRICE = '20000000000'
const MINIMUM_BALANCE = 10000000000000000
const GAS_LIMIT = '6500000'

const typeMap = new Map()
typeMap.set('0x6bf78b95', 'COMMENT')
typeMap.set('0x2fca5a5e', 'POST')
typeMap.set('0x04bc4e7a', 'AIRDROP')
typeMap.set('0xf7003d25', 'MILESTONE')

const userTypeMap = {
  'USER': '0x2db9fd3d',
  'KOL': '0xf4af7c06',
  'PF': '0x5707a2a6'
}

const boardMap = new Map()
boardMap.set(
  '0xfafe9e798792a4c59a71bf36c7082fa92c3849ffe26f8d2cf81f5f4da4e115ad',
  'MilestoneChatbot Test'
)
boardMap.set(
  '0xc6c260628ca29dfacadb60c8bb41d15dadc0dbc133680f7322b1a1008739b64f',
  'All'
)

class axiosUtils {
  static feedSysAPI

  static getFeedSysAPI () {
    if (!this.feedSysAPI) {
      const accessToken = store.getState().networkReducer.accessToken.jwt
      this.feedSysAPI = axios.create({
        baseURL: Config.FEED_END_POINT,
        headers: {
          'Authorization': accessToken,
          'Content-Type': 'application/json'
        }
      })
    }
    return this.feedSysAPI
  }
}

function generatePrivateKey () {
  let privateKey = CryptoUtils.generatePrivateKey()
  let publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
  let address = LocalAddress.fromPublicKey(publicKey).toString()
  return { privateKey, publicKey, address }
}

/*
  fetch the content of a single post from IPFS
  @param post A post object with its ipfsPath
  @return A post object with with its content
*/
async function _getSingleContent (post) {
  let ipfsContent = await axios.get(Config.INFURA_IPFS + post.ipfsPath)
  return { ...post, content: ipfsContent.data }
}

/*
  translate a given bytes32 hash into a multihash
  IPFS utils function
*/
function getMultihashFromBytes32 (digest) {
  const hashFunction = 18
  const size = 32

  // cut off leading "0x"
  const hashBytes = Buffer.from(digest.slice(2), 'hex')

  // prepend hashFunction and digest size
  const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length)
  multihashBytes[0] = hashFunction
  multihashBytes[1] = size
  multihashBytes.set(hashBytes, 2)

  return bs58.encode(multihashBytes)
}

/*
  translate a given multihash into bytes32 hash
  IPFS utils function
*/
function getBytes32FromMultiash (multihash) {
  const decoded = bs58.decode(multihash)

  return {
    digest: `0x${decoded.slice(2).toString('hex')}`,
    hashFunction: decoded[0],
    size: decoded[1]
  }
}

async function getPosts (request) {
  let feedData = await getFeedDataFromGetStream(request)
  const { requester } = request
  // build the arrays of post hash from feed data
  let postMap = new Map()
  let onChainPosts = []
  let offChainPosts = []
  for (let i = 0; i < feedData.results.length; i++) {
    if (feedData.results[i].source === 'ON-CHAIN') {
      // On-chain posts
      postMap.set(i, onChainPosts.length)
      onChainPosts.push(feedData.results[i].object.split(':')[1])
    } else if (feedData.results[i].source === 'OFF-CHAIN') {
      // Off-chain posts
      postMap.set(i, offChainPosts.length)
      offChainPosts.push(feedData.results[i].object.split(':')[1])
    }
  }

  let onChainPostDetails = []
  onChainPostDetails = await getOnChainPostDetails(onChainPosts)

  let offChainPostDetails = []
  offChainPostDetails = await getOffChainPostDetails(requester, offChainPosts)

  let postDetails = []

  for (let i = 0; i < feedData.results.length; i++) {
    if (feedData.results[i].source === 'ON-CHAIN') {
      postDetails.push({
        ...onChainPostDetails[postMap.get(i)],
        id: feedData.results[i].id,
        time: feedData.results[i].time,
        source: feedData.results[i].source,
        rewards: feedData.results.rewards
      })
    } else {
      postDetails.push({
        ...offChainPostDetails[postMap.get(i)],
        id: feedData.results[i].id,
        time: feedData.results[i].time,
        source: feedData.results[i].source,
        rewards: feedData.results.rewards
      })
    }
  }
  return {
    posts: postDetails,
    next: parseNext(feedData.next)
  }
}

function parseNext (next) {
  let result = {}
  if (next !== '') {
    const conditions = next.slice(next.indexOf('?') + 1).split('&')
    conditions.forEach(condition => {
      const keyValue = condition.split('=')
      if (keyValue[0] !== 'api_key') {
        result[keyValue[0]] = keyValue[1]
      }
    })
  }
  return result
}

async function getFeedDataFromGetStream (request) {
  const { feedSlug, feedId, limit, ranking, offset, id_lt } = request
  const toFeedTokenApi = {
    'feedSlug': feedSlug,
    'userId': feedId,
    'getStreamApiKey': Config.STREAM_API_KEY,
    'getStreamApiSecret': Config.STREAM_API_SECRET
  }
  // const feedSysAPI = axiosUtils.getFeedSysAPI()

  const response = await axios.post(
    Config.FEED_TOKEN_API,
    toFeedTokenApi
  )
  if (!response.data.ok) {
    throw (response)
  }
  // get feed data from Stream API
  const targetFeed = client.feed(feedSlug, feedId, response.data.feedToken)
  let feedData
  feedData = await targetFeed.get({
    ranking,
    offset,
    limit,
    id_lt
  })
  return feedData
}

async function getOffChainPostDetails (requester, offChainPosts) {
  let offChainPostDetails = []
  const pResult = await Promise.all(offChainPosts.map((postHash) => {
    const request = {
      'postHash': postHash,
      'requestor': requester,
      'getStreamApiKey': Config.STREAM_API_KEY,
      'getStreamApiSecret': Config.STREAM_API_SECRET
    }
    const feedSysAPI = axiosUtils.getFeedSysAPI()
    return feedSysAPI.post(
      `/get-feed-post`,
      request
    )
  }))

  if (pResult.length !== offChainPosts.length) {
    throw (new Error('Off-Chain data does not match.'))
  }
  for (let i = 0; i < pResult.length; i++) {
    if (!pResult[i].data.ok) {
      throw (pResult[i])
    }
    const { post } = pResult[i].data
    offChainPostDetails.push(post)
  }
  return offChainPostDetails
}

async function getOnChainPostDetails (onChainPosts) {
  const web3 = WalletUtils.getWeb3Instance()
  let BN = web3.utils.BN
  let onChainPostDetails = []
  if (onChainPosts.length > 0) {
    // get the flatten array of ipfs path, token address, author, rewards, # of replies from forum contract
    const forum = await WalletUtils.getContractInstance('Forum')
    let onChainPostData = []
    let receiveBuffer
    while (onChainPosts.length > 10) {
      const portionToFetch = onChainPosts.slice(0, 10)
      receiveBuffer = await forum.methods.getBatchPosts(portionToFetch).call()
      onChainPostData = onChainPostData.concat(receiveBuffer)
      onChainPosts = onChainPosts.slice(10)
    }
    receiveBuffer = await forum.methods.getBatchPosts(onChainPosts).call()
    onChainPostData = onChainPostData.concat(receiveBuffer)
    if (onChainPosts.length !== onChainPostData.length * 7) {
      throw (new Error('On-Chain data does not match.'))
    }
    let onChainPostMeta = []

    // Transform the flatten array from forum contract into an array of post objects
    let precision = 2
    for (let i = 0; i < onChainPostData.length; i += 7) {
      let hex = web3.utils.toBN(onChainPostData[i])
      let base = new BN(10).pow(new BN(18 - precision))
      if (!hex.isZero()) {
        onChainPostMeta.push({
          postHash: onChainPostData[i],
          ipfsPath: getMultihashFromBytes32(onChainPostData[i + 2]),
          actor: '0x' + onChainPostData[i + 3].substr(26, 40),
          rewards: (web3.utils.toBN(onChainPostData[i + 4]).div(base).toNumber()) / (10 ** 2),
          repliesLength: web3.utils.toDecimal(onChainPostData[i + 5]),
          postType: typeMap.get(onChainPostData[i + 6].slice(0, 10)),
          actorAddrAbbre: WalletUtils.getAddrAbbre('0x' + onChainPostData[i + 3].substr(26, 40))
        })
      } else {
        break
      }
    }
    // get the content of each post
    for (let i = 0; i < onChainPostMeta.length; i++) {
      let singleContent = await _getSingleContent(onChainPostMeta[i])
      onChainPostDetails.push(singleContent)
    }
  }
  return onChainPostDetails
}

/*
  Check if the user has enough ether for a tx
  @return true if the user has enough ether
*/
async function checkBalanceForTx () {
  let userBalance = await WalletUtils.getEthBalance()
  userBalance = userBalance * Math.pow(10, 18)
  return userBalance > MINIMUM_BALANCE
}

/*
   Return the bytes4 hash value of post type
   @param {string} type - type of the post
 */
function getPostTypeHash (type) {
  const web3 = WalletUtils.getWeb3Instance()
  return web3.eth.abi.encodeFunctionSignature(type)
}

/*
  @param content is a jsObject in a form of
    content ={
      title: "",
      text: "",
      image: "",
      subtitle: ""
    }
  /*
  @param boardId A bytes32 hash of the boardID
  @param parentHash A bytes32 hash of the post's parent
  @param postHash A bytes32 hash of the post
  @param postType A bytes4 hash of the post's type
  @param newContentToIPFS A callback function to be used when
    a new content is added to IPFS. It takes an IPFS path strign as parameter.
  @param newTransaction A callback function to be used when
    a new transaction is sent but before receipt. It takes a transaction hash as parameter.
*/
function newOnChainPost (
  content,
  boardId,
  parentHash,
  postType,
  newContentToIPFS,
  newTransaction,
  refreshCallback
) {
  return new Promise(async (resolve, reject) => {
    const enoughBalance = await checkBalanceForTx()
    if (!enoughBalance) {
      return reject(new Error('You do not have enough ethers'))
    }
    // prepare data for IPFS post
    const buf = Buffer.from(JSON.stringify(content))
    const data = buf.toJSON()
    const toIPFS = {
      'command': 'add',
      'data': data
    }

    // post content to IPFS
    const IPFSHash = await axios.post(
      Config.IPFS_POST_API,
      toIPFS
    )
    if (newContentToIPFS !== undefined) {
      newContentToIPFS(IPFSHash.data.body[0].path)
    }
    // translate multiHash into bytes32 hash
    const ipfsPath = getBytes32FromMultiash(IPFSHash.data.body[0].path).digest

    // add post to forum contract
    const forum = await WalletUtils.getContractInstance('Forum')
    let crypto = require('crypto')
    let postHash = '0x' + crypto.randomBytes(32).toString('hex')
    const hashedPostType = getPostTypeHash(postType)
    forum.methods
      .post(boardId, parentHash, postHash, ipfsPath, hashedPostType)
      .send({ gasPrice: GAS_PRICE })
      .on('transactionHash', (txHash) => {
        if (newTransaction !== undefined) {
          newTransaction(txHash)
        }
      })
      .on('receipt', (receipt) => {
        if (refreshCallback !== undefined) {
          refreshCallback()
        }
        resolve(receipt)
      })
      .on('error', (error) => {
        reject(error)
      })
  }
  )
}

function newOffChainPost (content, boardId, parentHash, postType, poster, refreshCallback) {
  return new Promise(async (resolve, reject) => {
    let crypto = require('crypto')
    let postHash = '0x' + crypto.randomBytes(32).toString('hex')
    const typeHash = getPostTypeHash(postType)
    const toDataBase =
    {
      'actor': poster,
      'boardId': boardId,
      'parentHash': parentHash,
      'postHash': postHash,
      'typeHash': typeHash,
      'content': content,
      'getStreamApiKey': Config.STREAM_API_KEY,
      'getStreamApiSecret': Config.STREAM_API_SECRET
    }
    const feedSysAPI = axiosUtils.getFeedSysAPI()
    const result = await feedSysAPI.post(
      `/feed-post`,
      toDataBase
    )
    if (result.data.ok) {
      if (refreshCallback !== undefined) {
        refreshCallback()
      }
      resolve(result)
    } else {
      reject(result)
    }
  })
}

function fetchUserMilstoneData (postHash, userAddress) {
  return new Promise(async (resolve, reject) => {
    const forum = await WalletUtils.getContractInstance('Forum')
    let milstoneData = await forum.methods.getMilestoneData(postHash).call()
    const userOptionBalance = await forum.methods.putOptionNumTokenForInvestor(postHash, userAddress).call()
    const milestoneTokenAddress = milstoneData[0]
    const milestoneAvailableToken = milstoneData[1]
    const milestonePrices = milstoneData[2]
    const milestoneEndTime = milstoneData[3]
    const optionsPurchased = milstoneData[4]
    const putOptionFeeRate = milstoneData[5]
    const putOptionFeeRateGtOne = milstoneData[6]

    milstoneData = {
      milestoneTokenAddress,
      milestoneAvailableToken,
      milestonePrices,
      milestoneEndTime,
      optionsPurchased,
      putOptionFeeRate,
      putOptionFeeRateGtOne
    }
    const tokenInstance = WalletUtils.getERC20Instance(milestoneTokenAddress)
    const tokenDecimals = await tokenInstance.methods.decimals().call()
    const tokenSymbol = await tokenInstance.methods.symbol().call()

    resolve({
      milestoneTokenAddress,
      milestoneAvailableToken,
      milestonePrices,
      milestoneEndTime,
      putOptionFeeRate,
      putOptionFeeRateGtOne,
      userOptionBalance,
      tokenSymbol,
      tokenDecimals
    })
  })
}

function purchasePutOption (postHash, purchaser, numToken, numVtxFeeToken, newTransation, refreshCallback) {
  return new Promise(async (resolve, reject) => {
    const vtxInstance = await WalletUtils.getContractInstance('Token')
    const forum = await WalletUtils.getContractInstance('Forum')

    const forumPurchasePutOptionData = forum.methods.purchasePutOption(postHash, purchaser, numToken).encodeABI()

    vtxInstance.methods.approveAndCall(forum.options.address, numVtxFeeToken, forumPurchasePutOptionData)
      .send({
        gasPrice: GAS_PRICE,
        gas: GAS_LIMIT
      }).on('transactionHash', (txHash) => {
        if (newTransation !== undefined) {
          newTransation(txHash)
        }
      }).on('receipt', (receipt) => {
        refreshCallback()
        resolve(receipt)
      }).on('error', (error) => {
        reject(error)
      })
  })
}

function executePutOption (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, newTransation, refreshCallback) {
  return new Promise(async (resolve, reject) => {
    const tokenInstance = WalletUtils.getERC20Instance(milestoneTokenAddress)
    const forum = await WalletUtils.getContractInstance('Forum')

    await tokenInstance.methods.approve(forum.options.address, numVtxFeeToken).send({
      gasPrice: GAS_PRICE,
      gas: GAS_LIMIT
    })

    forum.methods.executePutOption(postHash, numToken).send({
      gasPrice: GAS_PRICE,
      gas: GAS_LIMIT
    })
      .on('transactionHash', (txHash) => {
        if (newTransation !== undefined) {
          newTransation(txHash)
        }
      }).on('receipt', (receipt) => {
        refreshCallback()
        resolve(receipt)
      }).on('error', (error) => {
        reject(error)
      })
  })
}

function voteFeedPost (actor, postHash, value) {
  return new Promise(async (resolve, reject) => {
    const toDataBase = {
      actor,
      postHash,
      value
    }

    const feedSysAPI = axiosUtils.getFeedSysAPI()
    const result = await feedSysAPI.post(
      `/feed-upvote`,
      toDataBase
    )

    if (result.data.ok) {
      resolve(result)
    } else {
      reject(result)
    }
  })
}

async function fetchProfile (actor, username, telegramId) {
  const feedSysAPI = axiosUtils.getFeedSysAPI()
  const result = await feedSysAPI.post(
    `/get-profile`,
    { actor: actor }
  )
  if (result.data.ok) {
    return (result.data.profile)
  } else if (result.data.message && result.data.message.errorCode === 'NoPrincipalIdExisting') {
    // new user, register
    const profile = await registerUser(actor, username, telegramId)
    return profile
  } else {
    throw result.data.message
  }
}

function refuel (userAddress, reputations, refreshProfile) {
  return new Promise(async (resolve, reject) => {
    const feedSysAPI = axiosUtils.getFeedSysAPI()
    const result = await feedSysAPI.post(
      `/refuel-reputations`,
      {
        UserAddress: userAddress,
        reputations: reputations
      }
    )
    if (result.data.ok) {
      refreshProfile()
      resolve(result.data.reputations)
    } else {
      reject(result.data.message)
    }
  })
}

function getVoteCostEstimate (requestor, postHash) {
  const QUERY = 0
  return new Promise(async (resolve, reject) => {
    const toDataBase = {
      actor: requestor,
      postHash,
      value: QUERY
    }
    const feedSysAPI = axiosUtils.getFeedSysAPI()
    const result = await feedSysAPI.post(
      `/feed-upvote`,
      toDataBase
    )

    if (result.data.ok) {
      resolve(result.data.voteInfo)
    } else {
      reject(result)
    }
  })
}

async function registerUser (UUID, username, telegramId) {
  try {
    // generate a new private key
    let { privateKey, address } = generatePrivateKey()
    const web3 = WalletUtils.getWeb3Instance()
    privateKey = web3.utils.bytesToHex(privateKey)
    let userType = userTypeMap['USER']
    let reputation = 0
    let meta = {
      username: username,
      telegramId: telegramId.toString()
    }
    const rawUuid = '0x' + shake128(String(telegramId), 128)
    console.log('private key:', privateKey)
    await contract.start(privateKey)
    await contract.registerUser(rawUuid, address, userType, reputation, JSON.stringify(meta))
    await contract.disconnect()

    // successfully registered onchain
    // wait for database update, sleep for 2 seconds
    await delay(2000)

    // now, fetch user profile
    // let profile = await fetchProfile(UUID, username, telegramId)
    const feedSysAPI = axiosUtils.getFeedSysAPI()
    const result = await feedSysAPI.post(
      `/get-profile`,
      { actor: UUID }
    )
    if (!result.data.ok) {
      throw result.data.message
    }
    let { profile } = result.data

    // successfully retrieved profile, now register privateKey
    await setActorPrivateKey(UUID, privateKey)

    // set profile's privateKey manually
    profile.privateKey = privateKey
    return profile
  } catch (err) {
    throw err
  }
}

async function setActorPrivateKey (actor, privateKey) {
  const request = {
    actor: actor,
    privateKey: privateKey
  }
  const feedSysAPI = axiosUtils.getFeedSysAPI()
  const result = await feedSysAPI.post(
    '/set-actor-private-key',
    request
  )
  if (!result.data.ok) {
    throw result.data.message
  }
}

function getBatchPosts (postHashes) {
  return new Promise(async (resolve, reject) => {
    const request = {
      postHashes: postHashes
    }
    const feedSysAPI = axiosUtils.getFeedSysAPI()
    const result = await feedSysAPI.post(
      `/get-batch-posts`,
      request
    )
    if (result.data.ok) {
      resolve(result.data.posts)
    } else {
      reject(new Error('batch posts failed.'))
    }
  })
}

function getRecentPosts (actor) {
  return new Promise(async (resolve, reject) => {
    // get recent posts
    let request = {
      actor: actor,
      typeHash: getPostTypeHash('POST')
    }
    const feedSysAPI = axiosUtils.getFeedSysAPI()
    const recentPostsRequest = await feedSysAPI.post(
      `/get-recent-posts`,
      request
    )
    if (recentPostsRequest.data.ok) {
      if (recentPostsRequest.data.recentPosts === null) {
        return resolve([])
      }
      const recentPosts = recentPostsRequest.data.recentPosts
      let postHashes = []
      let mergeList = []
      recentPosts.forEach((post) => {
        postHashes.push(post.postHash)
        mergeList.push({
          deltaMilestonePoints: post.deltaMilestonePoints,
          createdAt: post.createdAt
        })
      })
      const postDetails = await getBatchPosts(postHashes)
      mergeList = mergeList.map((post, i) => {
        return ({
          ...post,
          content: postDetails[i].content,
          postOwnerUsername: postDetails[i].username
        })
      })
      resolve(mergeList)
    } else {
      reject(recentPostsRequest.message.ErrorInfo)
    }
  })
}

function getRecentComments (actor) {
  return new Promise(async (resolve, reject) => {
    // get recent Comments
    let request = {
      actor: actor,
      typeHash: getPostTypeHash('COMMENT')
    }
    const feedSysAPI = axiosUtils.getFeedSysAPI()
    const recentCommentsRequest = await feedSysAPI.post(
      `/get-recent-posts`,
      request
    )
    if (recentCommentsRequest.data.ok) {
      if (recentCommentsRequest.data.recentPosts === null) {
        return resolve([])
      }
      const recentComments = recentCommentsRequest.data.recentPosts
      let postHashes = []
      let mergeList = []
      recentComments.forEach((post) => {
        postHashes.push(post.postHash)
        mergeList.push({
          deltaMilestonePoints: post.deltaMilestonePoints,
          createdAt: post.createdAt
        })
      })
      const postDetails = await getBatchPosts(postHashes)
      mergeList = mergeList.map((post, i) => {
        return ({
          ...post,
          content: postDetails[i].content,
          postOwnerUsername: postDetails[i].username
        })
      })
      resolve(mergeList)
    } else {
      reject(recentCommentsRequest.message.ErrorInfo)
    }
  })
}

function getRecentVotes (actor) {
  return new Promise(async (resolve, reject) => {
    // get recent Votes
    let request = {
      actor: actor
    }
    const feedSysAPI = axiosUtils.getFeedSysAPI()
    const recentVotesRequest = await feedSysAPI.post(
      `/get-recent-votes`,
      request
    )
    if (recentVotesRequest.data.ok) {
      if (recentVotesRequest.data.recentVotes === null) {
        return resolve([])
      }
      const recentVotes = recentVotesRequest.data.recentVotes
      let postHashes = []
      let mergeList = []
      recentVotes.forEach((post) => {
        postHashes.push(post.postHash)
        mergeList.push({
          voteType: post.voteType,
          deltaMilestonePoints: post.deltaMilestonePoints,
          createdAt: post.createdAt
        })
      })
      const postDetails = await getBatchPosts(postHashes)
      mergeList = mergeList.map((post, i) => {
        const newItem = {
          ...post,
          content: postDetails[i].content,
          postOwnerUsername: postDetails[i].username
        }
        return newItem
      })
      resolve(mergeList)
    } else {
      reject(recentVotesRequest.message.ErrorInfo)
    }
  })
}

async function getAllReplies (request) {
  let replies = await getPosts(request)
  if (replies.posts.length !== 0) {
    replies = {
      ...replies,
      posts: await Promise.all(replies.posts.map(async (post) => {
        const subRelies = await getAllReplies({ ...request, feedId: post.postHash })
        return {
          ...post,
          replies: subRelies
        }
      }))
    }
  }
  return replies
}

async function getTargetPost (requester, postHash) {
  const feedSysAPI = axiosUtils.getFeedSysAPI()
  const result = await feedSysAPI.post(
    `/get-feed-post`,
    {
      'postHash': postHash,
      'requestor': requester,
      'getStreamApiKey': Config.STREAM_API_KEY,
      'getStreamApiSecret': Config.STREAM_API_SECRET
    }
  )
  if (result.data.ok) {
    const { post } = result.data
    return post
  } else {
    throw (result.data.message)
  }
}

async function followBoards (actor, boardIds) {
  const request = {
    actor: actor,
    boardIds: boardIds
  }

  const feedSysAPI = axiosUtils.getFeedSysAPI()
  const result = await feedSysAPI.post(
    `/subscribe-boards`,
    request
  )

  if (result.data.ok) {
    return result
  } else {
    throw (result.data.message)
  }
}

async function unfollowBoards (actor, boardIds) {
  const request = {
    actor: actor,
    boardIds: boardIds
  }

  const feedSysAPI = axiosUtils.getFeedSysAPI()
  const result = await feedSysAPI.post(
    `/unsubscribe-boards`,
    request
  )

  if (result.data.ok) {
    return result
  } else {
    throw (result.data.message)
  }
}

async function getUserFollowing (actor) {
  const toFeedTokenApi = {
    'feedSlug': 'user',
    'userId': actor,
    'getStreamApiKey': Config.STREAM_API_KEY,
    'getStreamApiSecret': Config.STREAM_API_SECRET
  }
  // const feedSysAPI = axiosUtils.getFeedSysAPI()
  const response = await axios.post(
    Config.FEED_TOKEN_API,
    toFeedTokenApi
  )
  if (!response.data.ok) {
    throw (response)
  }
  // get feed data from Stream API
  const targetFeed = client.feed('user', actor, response.data.feedToken)
  const following = await targetFeed.following()

  const result = following.results.map(item => {
    const boardId = item.target_id.split(':')[1]
    const boardName = boardMap.get(boardId)
    return {
      boardId: boardId,
      boardName: boardName,
      nameInitials: initials(boardName)
    }
  })

  return result
}

async function setNextRedeem (actor, milestonePoints, callback) {
  const request = {
    actor,
    milestonePoints
  }
  console.log(request)
  const feedSysAPI = axiosUtils.getFeedSysAPI()
  const response = await feedSysAPI.post(
    '/set-next-redeem',
    request
  )
  if (!response.data.ok) {
    throw new Error('set next redeem failed')
  }
  console.log(callback)
  callback()
}

async function getNextRedeem (actor) {
  const request = {
    actor
  }

  const feedSysAPI = axiosUtils.getFeedSysAPI()
  const response = await feedSysAPI.post(
    '/get-next-redeem',
    request
  )
  if (response.data.ok) {
    return response.data.nextRedeem
  } else {
    throw (response.data.message)
  }
}

async function getRedeemHistory (actor, limit = 50, cursor = '') {
  const request = {
    actor,
    limit,
    cursor
  }

  const feedSysAPI = axiosUtils.getFeedSysAPI()
  const response = await feedSysAPI.post(
    '/get-redeem-history',
    request
  )

  if (response.data.ok) {
    return response.data.responseData
  } else {
    throw (response.data.message)
  }
}

export {
  getPosts,
  checkBalanceForTx,
  getPostTypeHash,
  newOnChainPost,
  newOffChainPost,
  fetchUserMilstoneData,
  purchasePutOption,
  executePutOption,
  voteFeedPost,
  fetchProfile,
  refuel,
  client,
  getVoteCostEstimate,
  registerUser,
  getRecentPosts,
  getRecentComments,
  getRecentVotes,
  getAllReplies,
  getTargetPost,
  followBoards,
  unfollowBoards,
  getUserFollowing,
  setNextRedeem,
  getNextRedeem,
  getRedeemHistory
}
