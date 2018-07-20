import update from 'immutability-helper'
let moment = require('moment')
const initialState = {
  transactions: [],
  loading: false
}

export default function (state = initialState, action) {
  if (action.type === 'NEW_TRANSACTION') {
    return (
      update(
        state, { transactions: { $push: [{ hash: action.payload, status: 'Pending', timestamp: moment.utc().format('X') }] } }
      )
    )
  }

  if (action.type === 'UPDATE_TRANSACTION_FULFILLED' && action.payload !== null) {
    let targetIndex = -1
    for (let j = 0; j < action.payload.length; j++) {
      for (let i = 0; i < state.transactions.length; i++) {
        if (state.transactions[i].hash === action.payload[j].transactionHash) {
          targetIndex = i
        }
      }
      if (targetIndex !== -1) {
        return update(
          update(
            state,
            {
              transactions: {
                [targetIndex]:
                {
                  $set: { ...state.transactions[targetIndex], status: 'Fulfilled', receipt: action.payload[j] }
                }
              }
            }
          ),
          { loading: { $set: false } }
        )
      }
    }
    return {
      ...state,
      loading: false
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
      loading: true
    }
  }
  return state
}
