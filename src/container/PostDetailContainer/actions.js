import * as forum from '../../services/forum'
import {newTransaction} from '../TransactionContainer/actions'

function getReplies (postHash) {
  return {
    type: 'GET_REPLIES',
    payload: forum.batchReadFeedsByBoardId('comment:' + postHash)
  }
}

function _fetchUserMilstoneData (postHash, userAddress) {
  return {
    type: 'FETCH_USER_MILESTONE_DATA',
    payload: forum.fetchUserMilstoneData(postHash, userAddress)
  }
}

function fetchUserMilstoneData (postHash) {
  return (dispatch, getState) => {
    const userAddress = getState().walletReducer.walletAddress
    dispatch(_fetchUserMilstoneData(postHash, userAddress))
  }
}

function _processPurchasePutOption (postHash, purchaser, numToken, numVtxFeeToken, newTransaction) {
  return {
    type: 'PURCHASE_PUT_OPTION',
    payload: forum.purchasePutOption(postHash, purchaser, numToken, numVtxFeeToken, newTransaction)
  }
}

function _processExecutePutOption (postHash, numToken, numVtxFeeToken, newTransaction) {
  return {
    type: 'EXECUTE_PUT_OPTION',
    payload: forum.executePutOption(postHash, numToken, numVtxFeeToken, newTransaction)
  }
}

function processPutOption (postHash, numToken, numVtxFeeToken, action) {
  return (dispatch, getState) => {
    const purchaserAddress = getState().walletReducer.walletAddress
    if (action === 'Purchase') {
      dispatch(_processPurchasePutOption(
        postHash,
        purchaserAddress,
        numToken,
        numVtxFeeToken,
        (txHash) => { dispatch(newTransaction(txHash)) }
      ))
    } else {
      dispatch(_processExecutePutOption(
        postHash,
        numToken,
        numVtxFeeToken,
        (txHash) => { dispatch(newTransaction(txHash)) }
      ))
    }
  }
}

export { getReplies, fetchUserMilstoneData, processPutOption }
