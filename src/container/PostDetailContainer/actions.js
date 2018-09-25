import * as forum from '../../services/forum'
import { newTransaction } from '../TransactionContainer/actions'

function _getReplies (requester, postHash) {
  return {
    type: 'GET_REPLIES',
    payload: forum.batchReadFeedsByBoardId(requester, 'comment:' + postHash)
  }
}

function getReplies (postHash) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    dispatch(_getReplies(requester, postHash))
  }
}

function _fetchUserMilstoneData (postHash, actor) {
  return {
    type: 'FETCH_USER_MILESTONE_DATA',
    payload: forum.fetchUserMilstoneData(postHash, actor)
  }
}

function fetchUserMilstoneData (postHash) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_fetchUserMilstoneData(postHash, actor))
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

function _updatePostRewards (actor, boardId, postHash, value) {
  return {
    type: 'UPDATE_POST_REWARDS',
    payload: forum.updatePostRewards(actor, boardId, postHash, value)
  }
}
function updatePostRewards (boardId, postHash, value) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_updatePostRewards(actor, boardId, postHash, value))
  }
}

function clearPostDetail () {
  return {
    type: 'CLEAR_POST_DETAIL'
  }
}

function setCurrentParentPost (post) {
  return {
    type: 'SET_CURRENT_PARENT_POST',
    payload: post
  }
}

export { getReplies, fetchUserMilstoneData, processPutOption, clearPostDetail, updatePostRewards, setCurrentParentPost }
