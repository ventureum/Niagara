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

function _processPurchasePutOption (postHash, purchaser, numToken, numVtxFeeToken, newTransaction, refreshCallback) {
  return {
    type: 'PROCESS_PUT_OPTION',
    payload: forum.purchasePutOption(postHash, purchaser, numToken, numVtxFeeToken, newTransaction, refreshCallback)
  }
}

function _processExecutePutOption (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, newTransaction, refreshCallback) {
  return {
    type: 'PROCESS_PUT_OPTION',
    payload: forum.executePutOption(postHash, numToken, milestoneTokenAddress, numVtxFeeToken, newTransaction, refreshCallback)
  }
}

function processPutOption (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, refreshCallback) {
  return (dispatch, getState) => {
    const purchaserAddress = getState().walletReducer.walletAddress
    if (action === 'Purchase') {
      dispatch(_processPurchasePutOption(
        postHash,
        purchaserAddress,
        numToken,
        numVtxFeeToken,
        (txHash) => { dispatch(newTransaction(txHash)) },
        refreshCallback
      ))
    } else {
      dispatch(_processExecutePutOption(
        postHash,
        numToken,
        milestoneTokenAddress,
        numVtxFeeToken,
        (txHash) => { dispatch(newTransaction(txHash)) },
        refreshCallback
      ))
    }
  }
}

function clearPostDetail () {
  return {
    type: 'CLEAR_POST_DETAIL'
  }
}

export { getReplies, fetchUserMilstoneData, processPutOption, clearPostDetail }
