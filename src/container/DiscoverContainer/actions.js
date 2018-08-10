import * as forum from '../../services/forum'
import { newTransaction } from '../TransactionContainer/actions'

function refreshPosts (feedSlug, feedId) {
  return {
    type: 'REFRESH_POSTS',
    payload: forum.batchReadFeedsByBoardId(feedSlug + ':' + feedId)
  }
}

function _getMorePosts (feedSlug, feedId, lastUUID) {
  return {
    type: 'GET_MORE_POSTS',
    payload: forum.batchReadFeedsByBoardId(feedSlug + ':' + feedId, lastUUID)
  }
}

function getMorePosts (feedSlug, feedId) {
  return (dispatch, getState) => {
    const lastUUID = getState().discoverReducer.lastUUID
    dispatch(_getMorePosts(feedSlug, feedId, lastUUID))
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

function switchBoard (boardName, boardHash) {
  return {
    type: 'SWITCH_BOARD',
    meta: {
      boardHash: boardHash,
      boardName: boardName
    }
  }
}

function _newOnChainPost (content, boardId, parentHash, postType, newContentToIPFS, newTransaction) {
  return {
    type: 'NEW_POST',
    payload: forum.newOnChainPost(content, boardId, parentHash, postType, newContentToIPFS, newTransaction)
  }
}
function _newOffChainPost (content, boardId, parentHash, postType, actor) {
  return {
    type: 'NEW_POST',
    payload: forum.newOffChainPost(content, boardId, parentHash, postType, actor)
  }
}
function newPost (content, boardId, parentHash, postType, destination) {
  if (destination === 'ON-CHAIN') {
    return (dispatch) => {
      dispatch(_newOnChainPost(
        content,
        boardId,
        parentHash,
        postType,
        () => { },
        (txHash) => { dispatch(newTransaction(txHash)) }
      ))
    }
  }
  return (dispatch, getState) => {
    const poster = getState().walletReducer.walletAddress
    dispatch(_newOffChainPost(
      content,
      boardId,
      parentHash,
      postType,
      poster
    ))
  }
}

function _updatePostRewards (actor, boardId, postHash, value) {
  return {
    type: 'UPDATE_POST_REWARDS',
    payload: forum.updatePostRewards(actor, boardId, postHash, value)
  }
}
function updatePostRewards (boardId, postHash, value) {
  return (dispatch, getState) => {
    const actor = getState().walletReducer.walletAddress
    dispatch(_updatePostRewards(actor, boardId, postHash, value))
  }
}
export { refreshPosts, setTokens, getMorePosts, switchBoard, newPost, updatePostRewards }
