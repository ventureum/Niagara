import WalletUtils from '../../utils/wallet.js'

async function refreshToken (token, i) {
  token.balance = await WalletUtils.getBalance(token)
  return token
}

function _refreshTokens (tokens) {
  return {
    type: 'REFRESH_TOKENS',
    payload: Promise.all(tokens.map((token, i) => {
      return refreshToken(token, i)
    }))
  }
}

function refreshTokens () {
  return (dispatch, getState) => {
    let tokens = getState().assetsReducer.tokens
    dispatch(_refreshTokens(tokens))
  }
}

function initTokens () {
  return {
    type: 'INIT_TOKENS'
  }
}

function addTokenTransaction (tokenIdx: number, receipt: any) {
  return dispatch => {
    dispatch({
      type: 'ADD_TOKEN_TRANSACTION',
      tokenIdx,
      receipt
    })
  }
}

export { refreshTokens, initTokens, addTokenTransaction }
