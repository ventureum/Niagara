import * as forum from '../services/forum'
import WalletUtils from '../utils/wallet'
import { shake128 } from 'js-sha3'
import axios from 'axios'

const DEFAULT_GAS_LIMIT = 500000

export function listIsLoading (bool) {
  return {
    type: 'LIST_IS_LOADING',
    isLoading: bool
  }
}

export function fetchListSuccess (list) {
  return {
    type: 'FETCH_LIST_SUCCESS',
    list
  }
}

export function fetchList (url) {
  return dispatch => {
    dispatch(fetchListSuccess((url)))
    dispatch(listIsLoading(false))
  }
}

export function delisted (hash) {
  return dispatch => {
    dispatch({
      type: 'PROJECT_DELISTED',
      hash
    })
  }
}

export function whitelisted (hash) {
  return dispatch => {
    dispatch({
      type: 'PROJECT_WHITELISTED',
      hash
    })
  }
}

export function voted (hash) {
  return dispatch => {
    dispatch({
      type: 'PROJECT_VOTED',
      hash
    })
  }
}

export function setPinCode (pinCode) {
  return dispatch => {
    dispatch({
      type: 'SET_PIN_CODE',
      pinCode
    })
  }
}

export function setWalletAddress (address) {
  return dispatch => {
    dispatch({
      type: 'SET_WALLET_ADDRESS',
      address
    })
  }
}

export function setPrivateKey (privKey) {
  return dispatch => {
    dispatch({
      type: 'SET_PRIVATE_KEY',
      privKey
    })
  }
}

export function addToken (tokenSymbol, tokenAddr) {
  return {
    type: 'ADD_TOKEN',
    payload: {
      symbol: tokenSymbol,
      address: tokenAddr
    }
  }
}

export function removeToken (tokenSymbol, tokenAddr) {
  return {
    type: 'REMOVE_TOKEN',
    payload: {
      symbol: tokenSymbol,
      address: tokenAddr
    }
  }
}

export async function refreshToken (token, i) {
  token.balance = await WalletUtils.getBalance(token)
  return token
}

export function _refreshTokens (tokens) {
  return {
    type: 'REFRESH_TOKENS',
    payload: Promise.all(tokens.map((token, i) => {
      return refreshToken(token, i)
    }))
  }
}

export function refreshTokens () {
  return (dispatch, getState) => {
    let tokens = getState().assetsReducer.tokens
    dispatch(_refreshTokens(tokens))
  }
}

export function addTokenTransaction (receipt) {
  return dispatch => {
    dispatch({
      type: 'ADD_TOKEN_TRANSACTION',
      receipt
    })
  }
}

export function refreshLogs (tokenIdx, url) {
  return {
    type: 'REFRESH_LOGS',
    async payload () {
      const result = await axios.get(url)
      return { tokenIdx, result }
    }
  }
}

export function refreshPosts (feedSlug, feedId) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    dispatch(_refreshPosts(requester, feedSlug, feedId))
  }
}

export function _refreshPosts (requester, feedSlug, feedId) {
  return {
    type: 'REFRESH_POSTS',
    payload: forum.batchReadFeedsByBoardId(requester, feedSlug + ':' + feedId)
  }
}

export function _getMorePosts (requester, feedSlug, feedId, lastUUID) {
  return {
    type: 'GET_MORE_POSTS',
    payload: forum.batchReadFeedsByBoardId(requester, feedSlug + ':' + feedId, lastUUID)
  }
}

export function getMorePosts (feedSlug, feedId) {
  return (dispatch, getState) => {
    const lastUUID = getState().forumReducer.lastUUID
    const requester = getState().profileReducer.profile.actor
    dispatch(_getMorePosts(requester, feedSlug, feedId, lastUUID))
  }
}

export function setTokens (publicToken, userToken, timelineToken) {
  const tokens = { publicToken, userToken, timelineToken }
  return dispatch => {
    dispatch({
      type: 'SET_TOKENS',
      tokens
    })
  }
}

export function switchBoard (boardName, boardHash) {
  return {
    type: 'SWITCH_BOARD',
    meta: {
      boardHash: boardHash,
      boardName: boardName
    }
  }
}

export function _newOnChainPost (content, boardId, parentHash, postType, newContentToIPFS, newTransaction) {
  return {
    type: 'NEW_POST',
    payload: forum.newOnChainPost(content, boardId, parentHash, postType, newContentToIPFS, newTransaction)
  }
}

export function _newOffChainPost (content, boardId, parentHash, postType, actor) {
  return {
    type: 'NEW_POST',
    payload: forum.newOffChainPost(content, boardId, parentHash, postType, actor)
  }
}

export function newPost (content, boardId, parentHash, postType, destination) {
  if (destination === 'ON-CHAIN') {
    return (dispatch) => {
      dispatch(_newOnChainPost(
        content,
        boardId,
        parentHash,
        postType,
        () => { },
        (txHash) => { dispatch(newTransaction(txHash)) }
      ))
    }
  }
  return (dispatch, getState) => {
    const poster = getState().profileReducer.profile.actor
    dispatch(_newOffChainPost(
      content,
      boardId,
      parentHash,
      postType,
      poster
    ))
  }
}

export function _voteFeedPost (actor, postHash, action) {
  return {
    type: 'VOTE_FEED_POST',
    payload: forum.voteFeedPost(actor, postHash, action)
  }
}

export function voteFeedPost (postHash, action) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_voteFeedPost(actor, postHash, action))
  }
}

export function _voteFeedReply (actor, postHash, action) {
  return {
    type: 'VOTE_FEED_REPLY',
    payload: forum.voteFeedPost(actor, postHash, action)
  }
}

export function voteFeedReply (postHash, action) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_voteFeedReply(actor, postHash, action))
  }
}

export function _getVoteCostEstimate (requester, postHash) {
  return {
    type: 'GET_VOTE_COST_ESTIMATE',
    payload: forum.getVoteCostEstimate(requester, postHash)
  }
}

export function getVoteCostEstimate (postHash) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    dispatch(_getVoteCostEstimate(requester, postHash))
  }
}

export function resetErrorMessage () {
  return {
    type: 'RESET_ERROR_MESSAGE'
  }
}

export function _updateTargetPost (requester, postHash) {
  return {
    type: 'UPDATE_TARGET_POST',
    payload: forum.getTargetPost(requester, postHash)
  }
}

export function updateTargetPost (postHash) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    dispatch(_updateTargetPost(requester, postHash))
  }
}
export function _getReplies (requester, postHash) {
  return {
    type: 'GET_REPLIES',
    payload: forum.getAllReplies(requester, postHash)
  }
}

export function getReplies (postHash) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    dispatch(_getReplies(requester, postHash))
  }
}

export function _fetchUserMilstoneData (postHash, actor) {
  return {
    type: 'FETCH_USER_MILESTONE_DATA',
    payload: forum.fetchUserMilstoneData(postHash, actor)
  }
}

export function fetchUserMilstoneData (postHash) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_fetchUserMilstoneData(postHash, actor))
  }
}

export function _processPurchasePutOption (postHash, purchaser, numToken, numVtxFeeToken, newTransaction, refreshCallback) {
  return {
    type: 'PROCESS_PUT_OPTION',
    payload: forum.purchasePutOption(postHash, purchaser, numToken, numVtxFeeToken, newTransaction, refreshCallback)
  }
}

export function _processExecutePutOption (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, newTransaction, refreshCallback) {
  return {
    type: 'PROCESS_PUT_OPTION',
    payload: forum.executePutOption(postHash, numToken, milestoneTokenAddress, numVtxFeeToken, newTransaction, refreshCallback)
  }
}

export function processPutOption (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, refreshCallback) {
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

export function clearPostDetail () {
  return {
    type: 'CLEAR_POST_DETAIL'
  }
}

export function setCurrentParentPostHash (postHash) {
  return {
    type: 'SET_CURRENT_PARENT_POST_HASH',
    payload: postHash
  }
}

export function refreshViewingPost () {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    const postHash = getState().forumReducer.currentParentPostHash
    dispatch(_getReplies(requester, postHash))
    dispatch(updateTargetPost(postHash))
  }
}

export function _sendTransaction (receiverAddress, tokenSymbol, tokenAddress, amount, gasLimit, newTransaction) {
  return {
    type: 'SEND_TRANSACTION',
    payload: WalletUtils.sendTransaction(receiverAddress, tokenSymbol, tokenAddress, amount, gasLimit, newTransaction)
  }
}

export function sendTransaction (receiverAddress, tokenSymbol, tokenAddress, amount) {
  return (dispatch) => {
    dispatch(_sendTransaction(
      receiverAddress,
      tokenSymbol,
      tokenAddress,
      amount,
      DEFAULT_GAS_LIMIT,
      (txHash) => { dispatch(newTransaction(txHash)) }
    ))
  }
}

export function newTransaction (txHash) {
  return {
    type: 'NEW_TRANSACTION',
    payload: txHash
  }
}

export function updateTransaction (receipt) {
  return {
    type: 'UPDATE_TRANSACTION',
    payload: receipt
  }
}

export async function fetchTransactionStatus (transactionHash) {
  const web3 = await WalletUtils.getWeb3Instance()
  const receipt = await web3.eth.getTransactionReceipt(transactionHash)
  return receipt
}

export function _updateTransactionStatus (transactions) {
  return {
    type: 'UPDATE_TRANSACTION',
    payload: Promise.all(transactions.map((transaction, i) => {
      return fetchTransactionStatus(transaction.hash)
    }))
  }
}

export function updateTransactionStatus () {
  return (dispatch, getState) => {
    let pendingTransactions = []
    const transactions = getState().transactionReducer.transactions
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].status === 'Pending') {
        pendingTransactions.push(transactions[i])
      }
    }
    if (pendingTransactions.length !== 0) {
      dispatch(_updateTransactionStatus(pendingTransactions))
    }
  }
}

export function _fetchProfile (actor) {
  return {
    type: 'FETCH_PROFILE',
    payload: forum.fetchProfile(actor)
  }
}
export function fetchProfile () {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_fetchProfile(actor))
  }
}

export function _refuel (actor, reputations, refreshProfile) {
  return {
    type: 'REFUEL',
    payload: forum.refuel(actor, reputations, refreshProfile)
  }
}

export function refuel (reputations, refreshProfile) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_refuel(actor, reputations, refreshProfile))
  }
}

export function _registerUser (actor, username, telegramId, getUserData) {
  return {
    type: 'REGISTER_USER',
    payload: forum.registerUser(actor, username, telegramId, getUserData)
  }
}

export function registerUser (idRoot, username, telegramId) {
  const shakeHash = shake128(String(idRoot), 128)
  const hashBytes = Buffer.from(shakeHash, 'hex')
  const uuidParse = require('uuid-parse')
  const actor = uuidParse.unparse(hashBytes)
  return (dispatch, getState) => {
    dispatch(setActor(actor))
    dispatch(_registerUser(
      actor,
      username,
      String(telegramId),
      () => {
        dispatch(_fetchProfile(actor))
      }
    ))
  }
}

export function setActor (actor) {
  return {
    type: 'SET_ACTOR',
    payload: actor
  }
}

export function _getRecentVotes (actor) {
  return {
    type: 'GET_RECENT_VOTES',
    payload: forum.getRecentVotes(actor)
  }
}

export function getRecentVotes () {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_getRecentVotes(actor))
  }
}

export function _getRecentComments (actor) {
  return {
    type: 'GET_RECENT_COMMENTS',
    payload: forum.getRecentComments(actor)
  }
}

export function getRecentComments () {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_getRecentComments(actor))
  }
}

export function _getRecentPosts (actor) {
  return {
    type: 'GET_RECENT_POSTS',
    payload: forum.getRecentPosts(actor)
  }
}

export function getRecentPosts () {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_getRecentPosts(actor))
  }
}