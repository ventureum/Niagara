
const initialState = {
  chatContentLoading: false,
  fetchError: '',
  latestUUID: '',
  earliestUUID: '',
  chatContent: [],
  reachEarliestChat: false,
  fetchingLatest: false
}

export default function (state = initialState, action) {
  if (action.type === 'GET_INITIAL_CHAT_HISTORY_PENDING') {
    return {
      ...state,
      chatContentLoading: true
    }
  }
  if (action.type === 'GET_INITIAL_CHAT_HISTORY_FULFILLED') {
    const length = action.payload.length
    if (length !== 0) {
      return {
        ...state,
        chatContentLoading: false,
        chatContent: action.payload,
        latestUUID: action.payload[0].id,
        earliestUUID: action.payload[length - 1].id
      }
    }
    return {
      ...state,
      chatContentLoading: false
    }
  }
  if (action.type === 'GET_INITIAL_CHAT_HISTORY_REJECTED') {
    return {
      ...state,
      chatContentLoading: false,
      fetchError: action.payload
    }
  }
  if (action.type === 'FETCH_LATEST_CHAT_PENDING') {
    return {
      ...state,
      fetchingLatest: true
    }
  }
  if (action.type === 'FETCH_LATEST_CHAT_FULFILLED') {
    return {
      ...state,
      fetchingLatest: false,
      chatContent: action.payload.concat(state.chatContent),
      latestUUID: action.payload[0].id
    }
  }
  if (action.type === 'GFETCH_LATEST_CHAT_REJECTED') {
    return {
      ...state,
      fetchingLatest: false,
      fetchError: action.payload
    }
  }

  if (action.type === 'FETCH_EARLIER_CHAT_PENDING') {
    return {
      ...state,
      chatContentLoading: true
    }
  }
  if (action.type === 'FETCH_EARLIER_CHAT_FULFILLED') {
    const length = action.payload.length
    if (length !== 0) {
      return {
        ...state,
        chatContentLoading: false,
        chatContent: state.chatContent.concat(action.payload),
        earliestUUID: action.payload[length - 1].id
      }
    }
    return {
      ...state,
      chatContentLoading: false,
      reachEarliestChat: true
    }
  }
  if (action.type === 'FETCH_EARLIER_CHAT_REJECTED') {
    return {
      ...state,
      chatContentLoading: false,
      fetchError: action.payload
    }
  }

  if (action.type === 'CLEAR_CHAT') {
    return initialState
  }

  if (action.type === 'VOTE_FEED_POST_FULFILLED') {
    const { voteInfo } = action.payload.data
    return {
      ...state,
      loading: false,
      chatContent: state.chatContent.map(
        (item) => {
          return (item.postHash === voteInfo.postHash ? {
            ...item,
            postVoteCountInfo: voteInfo.postVoteCountInfo,
            requestorVoteCountInfo: voteInfo.requestorVoteCountInfo
          } : item
          )
        }
      )
    }
  }
  if (action.type === 'VOTE_FEED_POST_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'VOTE_FEED_POST_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload
    }
  }

  return state
}
