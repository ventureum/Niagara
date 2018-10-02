import WalletUtils from '../../utils/wallet.js'
import axios from 'axios'

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

function addTokenTransaction (receipt: any) {
  return dispatch => {
    dispatch({
      type: 'ADD_TOKEN_TRANSACTION',
      receipt
    })
  }
}

function refreshLogs (tokenIdx: number, url: string) {
  return {
    type: 'REFRESH_LOGS',
    async payload () {
      const result = await axios.get(url)
      return {tokenIdx, result}
    }
  }
}

export { refreshTokens, addTokenTransaction, refreshLogs }
