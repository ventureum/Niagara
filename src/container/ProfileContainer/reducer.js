const initialState = {
  reputation: 0,
  loading: false,
  errorMessage: ''
}

export default function (state = initialState, action) {
  if (action.type === 'UPDATE_REPUTATION_FULFILLED') {
    return {
      ...state,
      reputation: action.payload,
      loading: false
    }
  }
  if (action.type === 'UPDATE_REPUTATION_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload
    }
  }
  if (action.type === 'UPDATE_REPUTATION_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'REFUEL_REPUTATION_FULFILLED') {
    return {
      ...state,
      loading: false
    }
  }
  if (action.type === 'REFUEL_REPUTATION_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload
    }
  }
  if (action.type === 'REFUEL_REPUTATION_PENDING') {
    return {
      ...state,
      loading: true
    }
  }

  return state
}
