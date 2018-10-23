import Config from 'react-native-config'
import WalletUtils from '../utils/wallet'
import axios from 'axios'
import bs58 from 'bs58'

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

const boardMap = new Map()
boardMap.set(
  '0xfafe9e798792a4c59a71bf36c7082fa92c3849ffe26f8d2cf81f5f4da4e115ad',
  'MilestoneChatbot Test'
)

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

/*
  @param feed A string consist of the name of target feed group and userID.
    e.g.: 'board:all', 'comment:postHash', 'user:userID"
  @param id_lt A optional string paramater. It is used to fetch activities that has UUID
    less than id_lt from stream API
  @param size A optinal number paramater to determine the size of each fetch from Stream
    API. size must satisfy: 0 < size <= 10
  @return return a array of post details
*/
async function batchReadFeedsByBoardId (requester, feed, id_lt = null, id_gt = null, size, ranking) {
  let feedData = await getFeedDataFromGetStream(feed, id_lt, id_gt, size, ranking)

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

  return (postDetails)
}

async function getFeedDataFromGetStream (feed, id_lt = null, id_gt = null, size, ranking) {
  const feedSlug = feed.split(':')
  const toFeedTokenApi = {
    'feedSlug': feedSlug[0],
    'userId': feedSlug[1],
    'getStreamApiKey': Config.STREAM_API_KEY,
    'getStreamApiSecret': Config.STREAM_API_SECRET
  }
  const response = await axios.post(
    Config.FEED_TOKEN_API,
    toFeedTokenApi
  )
  if (!response.data.ok) {
    throw (response)
  }
  // get feed data from Stream API
  const targetFeed = client.feed(feedSlug[0], feedSlug[1], response.data.feedToken)
  let feedData
    if (id_lt === null && id_gt === null) { // eslint-disable-line
    feedData = await targetFeed.get({ limit: size, ranking: ranking })
    } else if (id_lt !== null && id_gt === null) { // eslint-disable-line
    feedData = await targetFeed.get({ limit: size, id_lt: id_lt })
    } else if (id_lt === null && id_gt !== null) { // eslint-disable-line
    feedData = await targetFeed.get({ limit: size, id_gt: id_gt })
  }
  const following = await targetFeed.following()
  console.log(`${feedSlug} follwing:`, following)
  return feedData
}

async function getOffChainPostDetails (requester, offChainPosts) {
  let offChainPostDetails = []
  const pResult = await Promise.all(offChainPosts.map((postHash) => {
    return axios.post(
      `${Config.FEED_END_POINT}/get-feed-post`,
      {
        'postHash': postHash,
        'requestor': requester,
        'getStreamApiKey': Config.STREAM_API_KEY,
        'getStreamApiSecret': Config.STREAM_API_SECRET
      }
    )
  }))

  if (pResult.length !== offChainPosts.length) {
    throw (new Error('Off-Chain data does not match.'))
  }
  for (let i = 0; i < pResult.length; i++) {
    if (!pResult[i].data.ok) {
      throw (pResult[i])
    }
    const { post, postVoteCountInfo, requestorVoteCountInfo } = pResult[i].data
    offChainPostDetails.push({
      ...post,
      postVoteCountInfo,
      requestorVoteCountInfo
    })
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
function newOnChainPost (content, boardId, parentHash, postType, newContentToIPFS, newTransaction) {
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
    forum.methods.post(boardId, parentHash, postHash, ipfsPath, hashedPostType).send({ gasPrice: GAS_PRICE })
      .on('transactionHash', (txHash) => {
        if (newTransaction !== undefined) {
          newTransaction(txHash)
        }
      })
      .on('receipt', (receipt) => {
        resolve(receipt)
      })
      .on('error', (error) => {
        reject(error)
      })
  }
  )
}

function newOffChainPost (content, boardId, parentHash, postType, poster) {
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
    const result = await axios.post(
      `${Config.FEED_END_POINT}/feed-post`,
      toDataBase
    )
    if (result.data.ok) {
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
    const result = await axios.post(
      `${Config.FEED_END_POINT}/feed-upvote`,
      toDataBase
    )

    if (result.data.ok) {
      resolve(result)
    } else {
      reject(result)
    }
  })
}

function fetchProfile (actor) {
  return new Promise(async (resolve, reject) => {
    const result = await axios.post(
      `${Config.FEED_END_POINT}/get-profile`,
      { actor: actor }
    )
    if (result.data.ok) {
      resolve(result.data)
    } else {
      reject(result.data.message)
    }
  })
}

function refuel (userAddress, reputations, refreshProfile) {
  return new Promise(async (resolve, reject) => {
    const result = await axios.post(
      `${Config.FEED_END_POINT}/refuel-reputations`,
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
    const result = await axios.post(
      `${Config.FEED_END_POINT}/feed-upvote`,
      toDataBase
    )

    if (result.data.ok) {
      resolve(result.data.voteInfo)
    } else {
      reject(result)
    }
  })
}

function registerUser (UUID, username, telegramId, getUserData) {
  return new Promise(async (resolve, reject) => {
    const request = {
      actor: UUID,
      username: username,
      UserType: 'USER',
      telegramId: telegramId
    }
    const result = await axios.post(
      `${Config.FEED_END_POINT}/profile`,
      request
    )
    if (result.data.ok) {
      getUserData()
      resolve(result.data.ok)
    } else {
      reject(result)
    }
  })
}

function getBatchPosts (postHashes) {
  return new Promise(async (resolve, reject) => {
    const request = {
      postHashes: postHashes
    }
    const result = await axios.post(
      `${Config.FEED_END_POINT}/get-batch-posts`,
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
    const recentPostsRequest = await axios.post(
      `${Config.FEED_END_POINT}/get-recent-posts`,
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
    const recentCommentsRequest = await axios.post(
      `${Config.FEED_END_POINT}/get-recent-posts`,
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
    const recentVotesRequest = await axios.post(
      `${Config.FEED_END_POINT}/get-recent-votes`,
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

async function getAllReplies (requester, postHash) {
  const feed = 'comment:' + postHash
  let replies = await batchReadFeedsByBoardId(requester, feed, null, null, 50)
  if (replies.length !== 0) {
    replies = await Promise.all(replies.map(async (reply) => {
      const subRelies = await getAllReplies(requester, reply.postHash)
      return {
        ...reply,
        replies: subRelies
      }
    }))
  }
  return replies
}

async function getTargetPost (requester, postHash) {
  const result = await axios.post(
    `${Config.FEED_END_POINT}/get-feed-post`,
    {
      'postHash': postHash,
      'requestor': requester,
      'getStreamApiKey': Config.STREAM_API_KEY,
      'getStreamApiSecret': Config.STREAM_API_SECRET
    }
  )
  if (result.data.ok) {
    const { post, postVoteCountInfo, requestorVoteCountInfo } = result.data
    return ({
      ...post,
      postVoteCountInfo,
      requestorVoteCountInfo
    })
  } else {
    throw (result.data.message)
  }
}

async function followBoards (actor, boardIds) {
  const request = {
    actor: actor,
    boardIds: boardIds
  }

  const result = await axios.post(
    `${Config.FEED_END_POINT}/subscribe-boards`,
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

  const result = await axios.post(
    `${Config.FEED_END_POINT}/unsubscribe-boards`,
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
  console.log(`${actor} follwing:`, following)

  const result = following.results.map(item => {
    const boardId = item.target_id.split(':')[1]
    return {
      boardId: boardId,
      boardName: boardMap.get(boardId)
    }
  })
  return result
}
export {
  batchReadFeedsByBoardId,
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
  getUserFollowing
}
