import { batchReadFeedsByBoardId } from '../../services/forum'

const INITIAL_FETCH_SIZE = 20

function getInitialChatHistory (postHash) {
  return {
    type: 'GET_INITIAL_CHAT_HISTORY',
    payload: batchReadFeedsByBoardId(
      `comment:${postHash}`,
      null,
      null,
      INITIAL_FETCH_SIZE
    )
  }
}

function _fetchLatestChat (postHash, latestUUID) {
  return {
    type: 'FETCH_LATEST_CHAT',
    payload: batchReadFeedsByBoardId(
      `comment:${postHash}`,
      null,
      latestUUID,
      INITIAL_FETCH_SIZE
    )
  }
}

function fetchLatestChat (postHash) {
  return (dispatch, getState) => {
    const latestUUID = getState().chatPageReducer.latestUUID
    dispatch(_fetchLatestChat(
      postHash,
      latestUUID
    ))
  }
}

function _fetchEalierChat (postHash, earliestUUID) {
  return {
    type: 'FETCH_EARLIER_CHAT',
    payload: batchReadFeedsByBoardId(
      `comment:${postHash}`,
      earliestUUID,
      null,
      INITIAL_FETCH_SIZE
    )
  }
}

function fetchEalierChat (postHash) {
  return (dispatch, getState) => {
    const earliestUUID = getState().chatPageReducer.earliestUUID
    dispatch(_fetchEalierChat(
      postHash,
      earliestUUID
    ))
  }
}

function clearChat () {
  return {
    type: 'CLEAR_CHAT'
  }
}

export { getInitialChatHistory, fetchLatestChat, clearChat, fetchEalierChat }
