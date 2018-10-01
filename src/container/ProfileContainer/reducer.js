const initialState = {
  loadingUser: false,
  errorMessage: '',
  profile: null,
  userLoaded: false,
  recentComments: {},
  recentPosts: {},
  recentVotes: {}
}

export default function (state = initialState, action) {
  if (action.type === 'FETCH_PROFILE_FULFILLED') {
    return {
      ...state,
      profile: action.payload.profile,
      loadingUser: false,
      userLoaded: true
    }
  }
  if (action.type === 'FETCH_PROFILE_REJECTED') {
    return {
      ...state,
      loadingUser: false,
      errorMessage: action.payload
    }
  }
  if (action.type === 'FETCH_PROFILE_PENDING') {
    return {
      ...state,
      loadingUser: true
    }
  }
  if (action.type === 'REFUEL_FULFILLED') {
    return {
      ...state,
      loading: false
    }
  }
  if (action.type === 'REFUEL_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload
    }
  }
  if (action.type === 'REFUEL_PENDING') {
    return {
      ...state,
      loading: true
    }
  }

  if (action.type === 'SET_ACTOR') {
    return {
      ...state,
      profile: { actor: action.payload }
    }
  }

  if (action.type === 'GET_RECENT_VOTES_FULFILLED') {
    return {
      ...state,
      recentVotes: action.payload
    }
  }
  if (action.type === 'GET_RECENT_VOTES_PENDING') {
    return {
      ...state,
      loadingRecentVotes: true
    }
  }
  if (action.type === 'GET_RECENT_VOTES_REJECTED') {
    return {
      ...state,
      recentVotesErrors: action.payload
    }
  }

  if (action.type === 'GET_RECENT_POSTS_FULFILLED') {
    return {
      ...state,
      recentPosts: action.payload
    }
  }
  if (action.type === 'GET_RECENT_POSTS_PENDING') {
    return {
      ...state,
      loadingRecentPosts: true
    }
  }
  if (action.type === 'GET_RECENT_POSTS_REJECTED') {
    return {
      ...state,
      recentPostsErrors: action.payload
    }
  }

  if (action.type === 'GET_RECENT_COMMENTS_FULFILLED') {
    return {
      ...state,
      recentComments: action.payload
    }
  }
  if (action.type === 'GET_RECENT_COMMENTS_PENDING') {
    return {
      ...state,
      loadingRecentComments: true
    }
  }
  if (action.type === 'GET_RECENT_COMMENTS_REJECTED') {
    return {
      ...state,
      recentCommentsErrors: action.payload
    }
  }
  return state
}
