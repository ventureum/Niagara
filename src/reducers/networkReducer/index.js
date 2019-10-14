const initialState = {
  ethereumNetwork: 'rinkeby',
  accessToken: {},
  getStreamToken: ''
}

export default function (state = initialState, action) {
  if (action.type === 'SET_ACCESS_TOKEN') {
    return {
      ...state,
      accessToken: action.payload
    }
  }

  if (action.type === 'CLEAR_LOGIN_INFO') {
    return {
      ...state,
      accessToken: {}
    }
  }
  return state
}
