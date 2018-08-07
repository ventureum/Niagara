const initialState = {
  replies: [],
  loading: false,
  errorMessage: '',
  milestoneData: {},
  milestoneDataLoading: false
}

export default function (state = initialState, action) {
  if (action.type === 'GET_REPLIES_PENDING') {
    return {
      ...state,
      loading: true,
      errorMessage: ''
    }
  }
  if (action.type === 'GET_REPLIES_FULFILLED') {
    return {
      ...state,
      loading: false,
      replies: action.payload,
      errorMessage: ''
    }
  }
  if (action.type === 'GET_REPLIES_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload
    }
  }

  if (action.type === 'FETCH_USER_MILESTONE_DATA_FULFILLED') {
    return {
      ...state,
      milestoneDataLoading: false,
      errorMessage: '',
      milestoneData: action.payload
    }
  }
  if (action.type === 'FETCH_USER_MILESTONE_DATA_PENDING') {
    return {
      ...state,
      milestoneDataLoading: true,
      errorMessage: ''
    }
  }
  if (action.type === 'FETCH_USER_MILESTONE_DATA_REJECTED') {
    return {
      ...state,
      milestoneDataLoading: false,
      errorMessage: action.payload
    }
  }
  if (action.type === 'CLEAR_POST_DETAIL') {
    return initialState
  }

  return state
}
