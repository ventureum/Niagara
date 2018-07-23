import Config from 'react-native-config'
import WalletUtils from '../utils/wallet'
import axios from 'axios'
import bs58 from 'bs58'

const stream = require('getstream')
const client = stream.connect(Config.STREAM_API_KEY)
const GAS_PRICE = '20000000000'
const MINIMUM_BALANCE = 10000000000000000

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
// @param size less than 10

/*
  @param feed A string consist of the name of target feed group and userID.
    e.g.: 'board:all', 'comment:postHash', 'user:userID"
  @param id_lt A optional string paramater. It is used to fetch activities that has UUID
    less than id_lt from stream API
  @param size A optinal number paramater to determine the size of each fetch from Stream
    API. size must satisfy: 0 < size <= 10
  @return return a array of post details
*/
async function batchReadFeedsByBoardId (feed, id_lt = null, size = 10) {
  // get feed token from lamda API
  const feedSlug = feed.split(':')
  const response = await axios.post(
    Config.FEED_TOKEN_API,
    {
      'feedSlug': feedSlug[0],
      'userId': feedSlug[1],
      'getStreamApiKey': Config.STREAM_API_KEY,
      'getStreamApiSecret': Config.STREAM_API_SECRET
    }
  )

  // get feed data from Stream API
  const targetFeed = client.feed(feedSlug[0], feedSlug[1], response.data.feedToken)
  let feedData
  if (id_lt === null) {
    feedData = await targetFeed.get({ limit: size })
  } else {
    feedData = await targetFeed.get({ limit: size, id_lt: id_lt })
  }

  // build the array of post hash from feed data
  let postsHash = []
  for (let i = 0; i < feedData.results.length; i++) {
    const hash = feedData.results[i].object.split(':')[1]
    postsHash.push(hash)
  }

  // get the flatten array of ipfs path, token address, author, rewards, # of replies from forum contract
  const forum = await WalletUtils.getContractInstance('Forum')
  const postDataFromForumContract = await forum.methods.getBatchPosts(postsHash).call()
  let posts = []

  // Transform the flatten array from forum contract into an array of post objects
  const web3 = WalletUtils.getWeb3Instance()
  let BN = web3.utils.BN
  let precision = 2
  for (let i = 0; i < postDataFromForumContract.length; i += 7) {
    let hex = web3.utils.toBN(postDataFromForumContract[i])
    let base = new BN(10).pow(new BN(18 - precision))

    if (!hex.isZero()) {
      posts.push({
        hash: postDataFromForumContract[i],
        token: {
          address: '0x' + postDataFromForumContract[i + 1].slice(26, 66),
          symbol: 'VTX'
        },
        ipfsPath: getMultihashFromBytes32(postDataFromForumContract[i + 2]),
        author: '0x' + postDataFromForumContract[i + 3].substr(26, 40),
        rewards: (web3.utils.toBN(postDataFromForumContract[i + 4]).div(base).toNumber()) / (10 ** 2),
        repliesLength: web3.utils.toDecimal(postDataFromForumContract[i + 5]),
        postType: postDataFromForumContract[i + 6],
        id: feedData.results[i / 7].id,
        time: feedData.results[i / 7].time
      })
    } else {
      break
    }
  }

  // get the content of each post
  let postContents = []
  for (let i = 0; i < posts.length; i++) {
    let singleContent = await _getSingleContent(posts[i])
    postContents.push(singleContent)
  }

  return postContents
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

function newPost (content, boardId, parentHash, postType, newContentToIPFS, newTransaction) {
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

    forum.methods.post(boardId, parentHash, postHash, ipfsPath, postType).send({ gasPrice: GAS_PRICE })
      .on('transactionHash', (txHash) => {
        if (newContentToIPFS !== undefined) {
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

export { batchReadFeedsByBoardId, checkBalanceForTx, getPostTypeHash, newPost }
