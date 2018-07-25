
const initialState = {
  loading: false,
  errorMessage: ''
}

export default function (state = initialState, action) {
  if (action.type === 'SEND_TRANSACTION_PENDING') {
    return {
      ...state,
      loading: true,
      errorMessage: ''
    }
  }
  if (action.type === 'SEND_TRANSACTION_FULFILLED') {
    return {
      ...state,
      loading: true,
      errorMessage: ''
    }
  }
  if (action.type === 'SEND_TRANSACTION_REJECTED') {
    return {
      ...state,
      loading: true,
      errorMessage: action.payload
    }
  }
  return state
}
