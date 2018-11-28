const initialState = {
  list: [],
  isLoading: true,
  hash: null,
  needUpdate: false
}

export default function (state = initialState, action) {
  if (action.type === 'FETCH_LIST_SUCCESS') {
    return {
      ...state,
      list: action.list,
      needUpdate: false
    }
  }
  if (action.type === 'LIST_IS_LOADING') {
    return {
      ...state,
      isLoading: action.isLoading
    }
  }
  if (action.type === 'PROJECT_DELISTED') {
    return {
      ...state,
      hash: action.hash,
      needUpdate: true
    }
  }
  if (action.type === 'PROJECT_WHITELISTED') {
    return {
      ...state,
      hash: action.hash,
      needUpdate: true
    }
  }
  if (action.type === 'PROJECT_VOTED') {
    return {
      ...state,
      hash: action.hash,
      needUpdate: true
    }
  }
  if (action.type === 'TCR_EVENT') {
    return {
      ...state,
      needUpdate: true
    }
  }

  if (action.type === 'CLEAR_LOGIN_INFO') {
    return initialState
  }

  return state
}
