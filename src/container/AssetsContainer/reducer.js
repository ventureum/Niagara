import { BigNumber } from 'bignumber.js'
import update from 'immutability-helper';

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
  }, {
    symbol: 'VTX',
    address: '0x7daa1a5f0b0ac9ada30f907e2b49c167bdd0460a',
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
      state,
      {logs: logs => update(logs || [], {$push: [action.receipt]})}
    )
  }
  if (action.type === 'REFRESH_LOGS_FULFILLED') {
    return update(
      update(
        state, 
        {tokens: {[action.tokenIdx]: {eventLogs: eventLogs => update(eventLogs || [], {$set: action.eventLogs})}}}
      ),
      {loading: {$set:false}}
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
  return state
}

