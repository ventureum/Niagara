const initialState = {
  currentParentPostHash: '',
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
    return {
      ...initialState,
      currentParentPostHash: state.currentParentPostHash
    }
  }

  if (action.type === 'PROCESS_PUT_OPTION_FULFILLED') {
    return {
      ...state,
      milestoneDataLoading: false
    }
  }
  if (action.type === 'PROCESS_PUT_OPTION_PENDING') {
    return {
      ...state,
      milestoneDataLoading: true
    }
  }
  if (action.type === 'PROCESS_PUT_OPTION_REJECTED') {
    return {
      ...state,
      milestoneDataLoading: false,
      errorMessage: action.payload
    }
  }

  if (action.type === 'VOTE_FEED_POST_FULFILLED') {
    const { voteInfo } = action.payload.data
    return {
      ...state,
      loading: false,
      replies: state.replies.map(
        (reply) => {
          return (reply.postHash === voteInfo.postHash ? {
            ...reply,
            postVoteCountInfo: voteInfo.postVoteCountInfo,
            requestorVoteCountInfo: voteInfo.requestorVoteCountInfo
          } : reply
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

  if (action.type === 'SET_CURRENT_PARENT_POST_HASH') {
    return {
      ...state,
      currentParentPostHash: action.payload
    }
  }
  return state
}
