import { batchReadFeedsByBoardId, addContentToIPFS, addPostToForum } from '../../services/forum'

function refreshPosts (feedSlug, feedId) {
  console.log(feedSlug, feedId)
  return {
    type: 'REFRESH_POSTS',
    payload: batchReadFeedsByBoardId(feedSlug + ':' + feedId)
  }
}

function _getMorePosts (feedSlug, feedId, lastUUID) {
  return {
    type: 'GET_MORE_POSTS',
    payload: batchReadFeedsByBoardId(feedSlug + ':' + feedId, lastUUID)
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
    payload: batchReadFeedsByBoardId('comment:' + postHash)
  }
}

function _addContentToIPFS (content) {
  return {
    type: 'ADD_CONTENT_TO_IPFS',
    payload: addContentToIPFS(content)
  }
}

function _addPostToForum (boardId, parentHash, postHash, ipfsPath) {
  return {
    type: 'ADD_POST_TO_FORUM',
    payload: addPostToForum(boardId, parentHash, postHash, ipfsPath)
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

export { refreshPosts, setTokens, getMorePosts, getReplies, _addContentToIPFS, _addPostToForum, switchBoard }
