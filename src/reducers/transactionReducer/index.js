import update from 'immutability-helper'
let moment = require('moment')

const initialState = {
  transactions: [],
  loading: false,
  errorMessage: ''
}

export default function reducer (state = initialState, action) {
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

  if (action.type === 'NEW_TRANSACTION') {
    return (
      update(
        state, { transactions: { $unshift: [{ hash: action.payload, status: 'Pending', timestamp: moment.utc().format('X') }] } }
      )
    )
  }

  if (action.type === 'UPDATE_TRANSACTION_FULFILLED') {
    let targetIndex = -1
    if (action.payload.length === 0 || action.payload[0] === null) {
      return {
        ...state,
        loading: false
      }
    }
    for (let i = 0; i < state.transactions.length; i++) {
      if (state.transactions[i].hash === action.payload[0].transactionHash) {
        targetIndex = i
      }
      if (targetIndex !== -1) {
        return update(
          reducer(state, { type: 'UPDATE_TRANSACTION_FULFILLED', payload: action.payload.slice(1) }),
          {
            transactions: {
              [targetIndex]:
              {
                $set: { ...state.transactions[targetIndex], status: 'Fulfilled', receipt: action.payload[0] }
              }
            }
          }
        )
      }
    }
  }

  if (action.type === 'UPDATE_TRANSACTION_PENDING') {
    return {
      ...state,
      loading: true
    }
  }

  if (action.type === 'UPDATE_TRANSACTION_REJECTED') {
    return {
      ...state,
      loading: false
    }
  }
  return state
}
