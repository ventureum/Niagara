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

function getReplies (postHash) {
  return {
    type: 'GET_REPLIES',
    payload: forum.batchReadFeedsByBoardId('comment:' + postHash)
  }
}

function addContentToIPFS (content) {
  return {
    type: 'ADD_CONTENT_TO_IPFS',
    payload: forum.addContentToIPFS(content)
  }
}

function _addPostToForum (boardId, parentHash, postHash, ipfsPath, postType, newTransaction) {
  return {
    type: 'ADD_POST_TO_FORUM',
    payload: forum.addPostToForum(boardId, parentHash, postHash, ipfsPath, postType, newTransaction)
  }
}

function addPostToForum (boardId, parentHash, postHash, ipfsPath, postType) {
  return (dispatch) => {
    dispatch(_addPostToForum(
      boardId,
      parentHash,
      postHash,
      ipfsPath,
      postType,
      (txHash) => { dispatch(newTransaction(txHash)) }
    ))
  }
}

function switchBoard (boardHash, boardName) {
  return {
    type: 'SWITCH_BOARD',
    meta: {
      boardHash: boardHash,
      boardName: boardName
    }
  }
}

export { refreshPosts, setTokens, getMorePosts, getReplies, addContentToIPFS, addPostToForum, switchBoard }
