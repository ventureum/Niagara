import WalletUtils from '../../utils/wallet.js'
let stream = require('getstream')
const client = stream.connect('6tp7vtdetzcd', null, '38815', { location: 'us-east' })

const NUMBER_OF_POSTS_PER_FETCH = 15

function _getTimelineFeed (feedToken) {
  const web3 = WalletUtils.getWeb3Instance()
  const userAddress = web3.eth.defaultAccount
  return client.feed('timeline', userAddress, feedToken)
}

function _refreshPosts (feed) {
  return {
    type: 'REFRESH_POSTS',
    payload: feed.get({ limit: NUMBER_OF_POSTS_PER_FETCH })
  }
}

function refreshPosts () {
  return (dispatch, getState) => {
    const feedToken = getState().discoverReducer.timelineToken
    const timelineFeed = _getTimelineFeed(feedToken)
    dispatch(_refreshPosts(timelineFeed))
  }
}

function _getMorePosts (offset, feed) {
  return {
    type: 'GET_MORE_POSTS',
    payload: feed.get({ limit: NUMBER_OF_POSTS_PER_FETCH, offset: offset }),
    meta: {
      offset
    }
  }
}

function getMorePosts () {
  return (dispatch, getState) => {
    const offset = getState().discoverReducer.offset + NUMBER_OF_POSTS_PER_FETCH
    const feedToken = getState().discoverReducer.timelineToken
    const timelineFeed = _getTimelineFeed(feedToken)
    dispatch(_getMorePosts(offset, timelineFeed))
  }
}

function setTokens (publicToken, userToken, timelineToken) {
  const tokens = { publicToken, userToken, timelineToken }
  return dispatch => {
    dispatch({
      type: 'SET_TOKENS',
      tokens
    })
  }
}

export { refreshPosts, setTokens, getMorePosts }
