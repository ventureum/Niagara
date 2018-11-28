import * as forum from '../services/forum'
import WalletUtils from '../utils/wallet'
import { shake128 } from 'js-sha3'
import axios from 'axios'

const DEFAULT_GAS_LIMIT = 500000
const FETCHING_SIZE = 5

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

function _refreshTokens (tokens) {
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

export function refreshPosts (feedSlug, feedId, targetArray, ranking) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    dispatch(_refreshPosts(requester, feedSlug, feedId, targetArray, ranking))
  }
}

function _refreshPosts (requester, feedSlug, feedId, targetArray, ranking) {
  return {
    type: 'REFRESH_POSTS',
    payload: forum.getPosts({
      requester,
      feedSlug,
      feedId,
      limit: FETCHING_SIZE,
      ranking
    }),
    meta: {
      targetArray: targetArray
    }
  }
}

function _getMorePosts (requester, feedSlug, feedId, targetArray, next) {
  return {
    type: 'GET_MORE_POSTS',
    payload: forum.getPosts({
      requester,
      feedSlug,
      feedId,
      ...next
    }),
    meta: {
      targetArray: targetArray
    }
  }
}

export function getMorePosts (feedSlug, feedId, targetArray) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    const next = getState().forumReducer[targetArray].next
    if (next.offset || next.id_lt) {
      dispatch(_getMorePosts(requester, feedSlug, feedId, targetArray, next))
    }
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

export function switchBoard (boardName, boardId) {
  return {
    type: 'SWITCH_BOARD',
    meta: {
      boardId: boardId,
      boardName: boardName
    }
  }
}

function _newOnChainPost (
  content,
  boardId,
  parentHash,
  postType,
  newContentToIPFS,
  newTransaction,
  refreshCallback
) {
  return {
    type: 'NEW_POST',
    payload: forum.newOnChainPost(
      content,
      boardId,
      parentHash,
      postType,
      newContentToIPFS,
      newTransaction,
      refreshCallback
    )
  }
}

function _newOffChainPost (content, boardId, parentHash, postType, actor, refreshCallback) {
  return {
    type: 'NEW_POST',
    payload: forum.newOffChainPost(content, boardId, parentHash, postType, actor, refreshCallback)
  }
}

export function newPost (content, boardId, parentHash, postType, destination, refreshCallback) {
  if (destination === 'ON-CHAIN') {
    return (dispatch) => {
      dispatch(_newOnChainPost(
        content,
        boardId,
        parentHash,
        postType,
        () => { },
        (txHash) => { dispatch(newTransaction(txHash)) },
        refreshCallback
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
      poster,
      refreshCallback
    ))
  }
}

function _voteFeedPost (actor, postHash, action) {
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

function _voteFeedReply (actor, postHash, action) {
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

function _getVoteCostEstimate (requester, postHash) {
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

function _updateTargetPost (requester, postHash, targetArray) {
  return {
    type: 'UPDATE_TARGET_POST',
    payload: forum.getTargetPost(requester, postHash),
    meta: {
      targetArray: targetArray
    }
  }
}

export function updateTargetPost (postHash, targetArray) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    dispatch(_updateTargetPost(requester, postHash, targetArray))
  }
}

function _getReplies (requester, feedSlug, feedId) {
  return {
    type: 'GET_REPLIES',
    payload: forum.getAllReplies({
      requester,
      feedSlug,
      feedId,
      limit: FETCHING_SIZE
    })
  }
}

export function getReplies (postHash) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    dispatch(_getReplies(requester, 'comment', postHash))
  }
}

function _getMoreReplies (requester, feedSlug, feedId, next) {
  return {
    type: 'GET_MORE_REPLIES',
    payload: forum.getAllReplies({
      requester,
      feedSlug,
      feedId,
      ...next
    })
  }
}

export function getMoreReplies (postHash) {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    const next = getState().forumReducer.replies.next
    if (next.offset || next.id_lt) {
      dispatch(_getMoreReplies(requester, 'comment', postHash, next))
    }
  }
}

function _fetchUserMilstoneData (postHash, actor) {
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

export function processPutOption (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, refreshCallback) {
  return (dispatch, getState) => {
    const purchaserAddress = getState().walletReducer.address
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

export function setCurrentParentPost (postHash, targetArray) {
  return {
    type: 'SET_CURRENT_PARENT_POST',
    payload: { postHash, targetArray }
  }
}

export function refreshViewingPost () {
  return (dispatch, getState) => {
    const requester = getState().profileReducer.profile.actor
    const post = getState().forumReducer.currentParentPost
    dispatch(_getReplies(requester, 'comment', post.postHash))
    dispatch(updateTargetPost(post.postHash, post.targetArray))
  }
}

function _sendTransaction (receiverAddress, tokenSymbol, tokenAddress, amount, gasLimit, newTransaction) {
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

function _updateTransactionStatus (transactions) {
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

function _fetchProfile (actor) {
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

function _refuel (actor, reputations, refreshProfile) {
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

function _registerUser (actor, username, telegramId, getUserData) {
  return {
    type: 'REGISTER_USER',
    payload: forum.registerUser(actor, username, telegramId, getUserData)
  }
}

export function registerUser (actor, username, telegramId) {
  return (dispatch) => {
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

export function loginUser (actor, username, telegramId) {
  return async (dispatch) => {
    const wallet = WalletUtils.generateWallet()
    dispatch({
      type: 'SET_WALLET_ADDRESS',
      address: wallet.address
    })
    dispatch({
      type: 'SET_PRIVATE_KEY',
      privKey: wallet.privateKey
    })
    try {
      const rv = await forum.fetchProfile(actor)
      // user registered before
      dispatch({
        type: 'FETCH_PROFILE_FULFILLED',
        payload: rv
      }
      )
    } catch (e) {
      // new user
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
}

export function setAccessToken (token) {
  return {
    type: 'SET_ACCESS_TOKEN',
    payload: token
  }
}

function _getRecentVotes (actor) {
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

function _getRecentComments (actor) {
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

function _getRecentPosts (actor) {
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

export function followBoards (boardIds) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    const callback = () => dispatch(getUserFollowing(actor))
    dispatch(_followBoards(actor, boardIds, callback))
  }
}

function _followBoards (actor, boardIds, callback) {
  return {
    type: 'FOLLOW_BOARDS',
    payload: forum.followBoards(actor, boardIds).then(
      setTimeout(callback, 500)
    )
  }
}

export function unfollowBoards (boardIds) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    const callback = () => dispatch(getUserFollowing(actor))
    dispatch(_unfollowBoards(actor, boardIds, callback))
  }
}

function _unfollowBoards (actor, boardIds, callback) {
  return {
    type: 'UNFOLLOW_BOARDS',
    payload: forum.unfollowBoards(actor, boardIds).then(
      setTimeout(callback, 500)
    )
  }
}

export function getUserFollowing () {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_getUserFollowing(actor))
  }
}

function _getUserFollowing (actor) {
  return {
    type: 'GET_USER_FOLLOWING',
    payload: forum.getUserFollowing(actor)
  }
}

export function clearBoardDetail () {
  return {
    type: 'CLEAR_BOARD_DETAIL'
  }
}

export function clearLoginInfo () {
  return {
    type: 'CLEAR_LOGIN_INFO'
  }
}
