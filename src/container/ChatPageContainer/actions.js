import {batchReadFeedsByBoardId} from '../../services/forum'

const INITIAL_FETCH_SIZE = 50

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

function clearChat () {
  return {
    type: 'CLEAR_CHAT'
  }
}

export {getInitialChatHistory, fetchLatestChat, clearChat}
