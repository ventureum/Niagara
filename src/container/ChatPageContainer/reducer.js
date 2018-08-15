
const initialState = {
  chatContentLoading: false,
  fetchError: '',
  latestUUID: '',
  lastUUID: '',
  chatContent: []
}

export default function (state = initialState, action) {
  if (action.type === 'GET_INITIAL_CHAT_HISTORY_PENDING') {
    return {
      ...state,
      chatContentLoading: true
    }
  }
  if (action.type === 'GET_INITIAL_CHAT_HISTORY_FULFILLED') {
    if (action.payload.length !== 0) {
      return {
        ...state,
        chatContentLoading: false,
        chatContent: action.payload,
        latestUUID: action.payload[0].id
      }
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
      chatContentLoading: true
    }
  }
  if (action.type === 'FETCH_LATEST_CHAT_FULFILLED') {
    return {
      ...state,
      chatContentLoading: false,
      chatContent: action.payload.concat(state.chatContent),
      latestUUID: action.payload[0].id
    }
  }
  if (action.type === 'GFETCH_LATEST_CHAT_REJECTED') {
    return {
      ...state,
      chatContentLoading: false,
      fetchError: action.payload
    }
  }
  if (action.type === 'CLEAR_CHAT') {
    return initialState
  }
  return state
}
