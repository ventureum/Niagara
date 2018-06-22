import { BigNumber } from 'bignumber.js'
import update from 'immutability-helper';

const initialState = {
  loading: false,
  error: false,
  tokens: [{
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    balance: new BigNumber(0),
    value: 0
  }, {
    symbol: 'VTX',
    address: '0xe19a5acadad67ff06c28ebe8d97dd36f20f9f373',
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
  if (action.type === 'INIT_TOKENS') {
    return {
      ...initialState
    }
  }
  if (action.type === 'ADD_TOKEN_TRANSACTION') {
    return update(
      update(
        state, 
        {tokens: {[action.tokenIdx]: {logs: logs => update(logs || [], {$push: [action.receipt]})}}}
      ),
      {logs: logs => update(logs || [], {$push: [action.receipt]})}
    )
  }
  return state
}

