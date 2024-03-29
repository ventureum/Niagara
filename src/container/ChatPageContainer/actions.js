import * as forum from '../../services/forum'

const INITIAL_FETCH_SIZE = 20

function getInitialChatHistory (postHash) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    dispatch(_getInitialChatHistory(
      requester,
      postHash
    ))
  }
}

function _getInitialChatHistory (requester, postHash) {
  return {
    type: 'GET_INITIAL_CHAT_HISTORY',
    payload: forum.getPosts(
      requester,
      `comment:${postHash}`,
      null,
      null,
      INITIAL_FETCH_SIZE
    )
  }
}

function _fetchLatestChat (requester, postHash, latestUUID) {
  return {
    type: 'FETCH_LATEST_CHAT',
    payload: forum.getPosts(
      requester,
      `comment:${postHash}`,
      null,
      latestUUID
    )
  }
}

function fetchLatestChat (postHash) {
  return (dispatch, getState) => {
    const latestUUID = getState().chatPageReducer.latestUUID
    const requester = getState().profileReducer.profile.actor
    dispatch(_fetchLatestChat(
      requester,
      postHash,
      latestUUID
    ))
  }
}

function _fetchEalierChat (requester, postHash, earliestUUID) {
  return {
    type: 'FETCH_EARLIER_CHAT',
    payload: forum.getPosts(
      requester,
      `comment:${postHash}`,
      INITIAL_FETCH_SIZE
    )
  }
}

function fetchEalierChat (postHash) {
  return (dispatch, getState) => {
    const earliestUUID = getState().chatPageReducer.earliestUUID
    const requester = getState().profileReducer.profile.actor
    dispatch(_fetchEalierChat(
      requester,
      postHash,
      earliestUUID
    ))
  }
}

function _voteFeedPost (actor, postHash, action) {
  return {
    type: 'VOTE_FEED_POST',
    payload: forum.voteFeedPost(actor, postHash, action)
  }
}
function voteFeedPost (postHash, action) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_voteFeedPost(actor, postHash, action))
  }
}

function clearChat () {
  return {
    type: 'CLEAR_CHAT'
  }
}

export { getInitialChatHistory, fetchLatestChat, clearChat, fetchEalierChat, voteFeedPost }
