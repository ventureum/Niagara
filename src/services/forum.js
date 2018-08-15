import Config from 'react-native-config'
import WalletUtils from '../utils/wallet'
import axios from 'axios'
import bs58 from 'bs58'

const stream = require('getstream')
const client = stream.connect(Config.STREAM_API_KEY, null, 39296)
const GAS_PRICE = '20000000000'
const MINIMUM_BALANCE = 10000000000000000
const GAS_LIMIT = '6500000'

const typeMap = new Map()
typeMap.set('0x6bf78b95', 'COMMENT')
typeMap.set('0x2fca5a5e', 'POST')
typeMap.set('0x04bc4e7a', 'AIRDROP')
typeMap.set('0xf7003d25', 'MILESTONE')

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
function batchReadFeedsByBoardId (feed, id_lt = null, id_gt = null, size = 10) {
  return new Promise(async (resolve, reject) => {
    // get feed token from lamda API
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
      reject(response.data.message)
    }
    // get feed data from Stream API
    const targetFeed = client.feed(feedSlug[0], feedSlug[1], response.data.feedToken)
    let feedData
    if (id_lt === null && id_gt === null) {
      feedData = await targetFeed.get({ limit: size })
    } else if (id_lt !== null && id_gt === null) {
      feedData = await targetFeed.get({ limit: size, id_lt: id_lt })
    } else if (id_lt === null && id_gt !== null) {
      feedData = await targetFeed.get({ limit: size, id_gt: id_gt })
    }

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

      onChainPostData = await forum.methods.getBatchPosts(onChainPosts).call()
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
            postType: typeMap.get(onChainPostData[i + 6].slice(0, 10))
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

    let offChainPostDetails = []
    const pResult = await Promise.all(offChainPosts.map((postHash) => {
      return axios.post(
        `${Config.FEED_END_POINT}/get-feed-post`,
        {
          'postHash': postHash,
          'getStreamApiKey': Config.STREAM_API_KEY,
          'getStreamApiSecret': Config.STREAM_API_SECRET
        }
      )
    }))
    for (let i = 0; i < pResult.length; i++) {
      let precision = 2
      let base = new BN(10).pow(new BN(18 - precision))
      const { post } = pResult[i].data
      offChainPostDetails.push({
        postHash: post.postHash,
        actor: post.actor,
        rewards: (web3.utils.toBN(0).div(base).toNumber()) / (10 ** 2),
        repliesLength: web3.utils.toDecimal(0),
        postType: post.postType,
        content: post.content
      })
    }

    let postDetails = []
    for (let i = 0; i < feedData.results.length; i++) {
      if (feedData.results[i].source === 'ON-CHAIN') {
        postDetails.push({
          ...onChainPostDetails[postMap.get(i)],
          id: feedData.results[i].id,
          time: feedData.results[i].time,
          source: feedData.results[i].source
        })
      } else {
        postDetails.push({
          ...offChainPostDetails[postMap.get(i)],
          id: feedData.results[i].id,
          time: feedData.results[i].time,
          source: feedData.results[i].source
        })
      }
    }
    resolve(postDetails)
  })
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
      reject(new Error('You do not have enough ethers'))
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

function updatePostRewards (actor, boardId, postHash, value) {
  return new Promise(async (resolve, reject) => {
    const toDataBase = {
      actor,
      boardId,
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

function getReputation (userAddress) {
  return new Promise(async (resolve, reject) => {
    const result = await axios.post(
      `${Config.FEED_END_POINT}/get-reputations`,
      { UserAddress: userAddress }
    )
    if (result.data.ok) {
      resolve(result.data.reputations)
    } else {
      reject(result.data.message)
    }
  })
}

function refuelReputation (userAddress, reputations, refreshProfile) {
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

export {
  batchReadFeedsByBoardId,
  checkBalanceForTx,
  getPostTypeHash,
  newOnChainPost,
  newOffChainPost,
  fetchUserMilstoneData,
  purchasePutOption,
  executePutOption,
  updatePostRewards,
  getReputation,
  refuelReputation,
  client
}
