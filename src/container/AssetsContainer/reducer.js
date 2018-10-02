import { BigNumber } from 'bignumber.js'
import update from 'immutability-helper'
import WalletUtils from '../../utils/wallet.js'

const NUMBER_OF_TX_TO_FETCH = 20
const initialState = {
  loading: false,
  blockFetched: 0,
  error: false,
  tokens: [{
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    balance: new BigNumber(0),
    value: 0
  }],
  totalVal: 0
}

export default function (state: any = initialState, action: Function) {
  if (action.type === 'REFRESH_TOKENS_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'REFRESH_TOKENS_FULFILLED') {
    return {
      ...state,
      loading: false,
      error: false,
      tokens: action.payload
    }
  }
  if (action.type === 'REFRESH_TOKENS_REJECTED') {
    return {
      ...state,
      loading: false,
      error: true
    }
  }

  if (action.type === 'ADD_TOKEN_TRANSACTION') {
    return update(
      state,
      { logs: logs => update(logs || [], { $push: [action.receipt] }) }
    )
  }
  if (action.type === 'REFRESH_LOGS_FULFILLED') {
    let validLogs = []
    const { result } = action.payload
    if (result.data.message === 'OK') {
      for (let i = 0; i < result.data.result.length; i++) {
        if (validLogs.length === NUMBER_OF_TX_TO_FETCH) {
          break
        }
        if (result.data.result[i].value !== '0') {
          validLogs.push(result.data.result[i])
        }
      }
    }
    return update(
      update(
        state,
        { tokens: { [action.payload.tokenIdx]: { eventLogs: eventLogs => update(eventLogs || [], { $set: validLogs }) } } }
      ),
      { loading: { $set: false } }
    )
  }
  if (action.type === 'REFRESH_LOGS_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'REFRESH_LOGS_REJECTED') {
    return {
      ...state,
      loading: false
    }
  }
  if (action.type === 'ADD_TOKEN') {
    let tokens = state.tokens
    let token = WalletUtils.getToken(action.payload.symbol, action.payload.address)
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].symbol === action.payload.symbol &&
        tokens[i].address === action.payload.address) {
        // token already exist, ignore the operation
        return state
      }
    }
    if (token) {
      return update(
        state,
        { tokens: tokens => update(tokens || [], { $push: [{ ...token, balance: 0, value: 0 }] }) }
      )
    }
  }
  if (action.type === 'REMOVE_TOKEN') {
    let tokens = state.tokens
    let tokensAfterRemoval = []
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].address !== action.payload.address) {
        tokensAfterRemoval.push(tokens[i])
      }
    }
    return {
      ...state,
      tokens: tokensAfterRemoval
    }
  }

  return state
}
