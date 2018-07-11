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
  const postDataFromForumContrat = await forum.methods.getBatchPosts(postsHash).call()
  let posts = []

  // Transform the flatten array from forum contract into an array of post objects
  const web3 = WalletUtils.getWeb3Instance()
  let BN = web3.utils.BN
  let precision = 2
  for (let i = 0; i < postDataFromForumContrat.length; i += 6) {
    let hex = web3.utils.toBN(postDataFromForumContrat[i])
    let base = new BN(10).pow(new BN(18 - precision))

    if (!hex.isZero()) {
      posts.push({
        hash: postDataFromForumContrat[i],
        token: {
          address: '0x' + postDataFromForumContrat[i + 1].slice(26, 66),
          symbol: 'VTX'
        },
        ipfsPath: getMultihashFromBytes32(postDataFromForumContrat[i + 2]),
        author: '0x' + postDataFromForumContrat[i + 3].substr(26, 40),
        rewards: (web3.utils.toBN(postDataFromForumContrat[i + 4]).div(base).toNumber()) / (10 ** 2),
        repliesLength: web3.utils.toDecimal(postDataFromForumContrat[i + 5]),
        id: feedData.results[i / 6].id,
        time: feedData.results[i / 6].time
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
  @param content is a jsObject in a form of
    content ={
      title: "",
      text: "",
      image: ""
    }
  @param return the bytes32 path hash on IPFS of the content
  Add a given content to IPFS
*/
async function addContentToIPFS (content) {
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

  // translate multiHash into bytes32 hash
  const ipfsPath = getBytes32FromMultiash(IPFSHash.data.body[0].path).digest

  return ipfsPath
}

/*
  @param boardId A bytes32 hash of the boardID
  @param parentHash A bytes32 hash of the post's parent
  @param postHash A bytes32 hash of the post
  @param ipfsPath a bytes32 path hash on IPFS of the post content
  Add the post to Forum contract
*/
async function addPostToForum (boardId, parentHash, postHash, ipfsPath) {
  const forum = await WalletUtils.getContractInstance('Forum')
  await forum.methods.post(boardId, parentHash, postHash, ipfsPath).send({ gasPrice: GAS_PRICE })
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

export { batchReadFeedsByBoardId, addContentToIPFS, addPostToForum, checkBalanceForTx }
