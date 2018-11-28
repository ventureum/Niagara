const initialState = {
  pinCode: '',
  address: '',
  privateKey: ''
}

export default function (state = initialState, action) {
  if (action.type === 'SET_PIN_CODE') {
    return {
      ...state,
      pinCode: action.pinCode
    }
  }
  if (action.type === 'SET_WALLET_ADDRESS') {
    return {
      ...state,
      address: action.address
    }
  }
  if (action.type === 'SET_PRIVATE_KEY') {
    return {
      ...state,
      privateKey: action.privKey
    }
  }
  return state
}
