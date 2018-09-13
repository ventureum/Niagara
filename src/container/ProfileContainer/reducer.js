const initialState = {
  loadingUser: false,
  errorMessage: '',
  profile: null
}

export default function (state = initialState, action) {
  if (action.type === 'FETCH_PROFILE_FULFILLED') {
    return {
      ...state,
      profile: action.payload.profile,
      loadingUser: false
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

  return state
}
