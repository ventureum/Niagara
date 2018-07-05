import WalletUtils from '../utils/wallet'
import axios from 'axios'
import bs58 from 'bs58'

const stream = require('getstream')
const apiSecret = ''
const apiKey = ''
const client = stream.connect(apiKey)

/*
  fetch the content of a single post from IPFS
  @param post A post object with its ipfsPath
  @return A post object with with its content
*/
async function _getSingleContent (post) {
  let ipfsContent = await axios.get('https://ipfs.infura.io/ipfs/' + post.ipfsPath)
  return { ...post, content: ipfsContent.data }
}

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
    'https://dh3rwe6m9a.execute-api.ca-central-1.amazonaws.com/prod/feed_token',
    {
      'feedSlug': feedSlug[0],
      'userId': feedSlug[1],
      'getStreamApiKey': apiKey,
      'getStreamApiSecret': apiSecret
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
        id: feedData.results[i / 6].id
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

export { batchReadFeedsByBoardId }
