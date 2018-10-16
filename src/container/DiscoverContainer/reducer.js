import update from 'immutability-helper'
import { BOARD_ALL_HASH } from '../../utils/constants.js'

const initialState = {
  boardHash: BOARD_ALL_HASH,
  boardName: 'All',
  posts: [],
  lastUUID: '',
  loading: false,
  errorMessage: '',
  fetchingVoteCost: false,
  voteInfo: null,
  voteInfoError: null
}

export default function (state: any = initialState, action: Function) {
  if (action.type === 'REFRESH_POSTS_FULFILLED') {
    const length = action.payload.length
    if (length === 0) {
      return {
        ...state,
        loading: false,
        posts: [],
        errorMessage: ''
      }
    }
    return {
      ...state,
      posts: action.payload,
      lastUUID: action.payload[length - 1].id,
      loading: false,
      errorMessage: ''
    }
  }

  if (action.type === 'REFRESH_POSTS_PENDING') {
    return {
      ...state,
      loading: true,
      errorMessage: ''
    }
  }
  if (action.type === 'REFRESH_POSTS_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload.data.message.errorCode
    }
  }
  if (action.type === 'GET_MORE_POSTS_FULFILLED') {
    const length = action.payload.length
    if (length === 0) {
      return {
        ...state,
        loading: false,
        errorMessage: ''
      }
    }
    return update(
      update(
        update(
          update(
            state,
            { posts: { $push: action.payload } }
          ),
          { lastUUID: { $set: action.payload[length - 1].id } }
        ),
        { loading: { $set: false } }
      ),
      { errorMessage: { $set: '' } }
    )
  }

  if (action.type === 'SWITCH_BOARD') {
    return {
      ...state,
      boardHash: action.meta.boardHash,
      boardName: action.meta.boardName,
      posts: []
    }
  }

  if (action.type === 'NEW_POST_PENDING') {
    return {
      ...state,
      loading: true,
      errorMessage: ''
    }
  }

  if (action.type === 'NEW_POST_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload.data.message.errorCode
    }
  }

  if (action.type === 'NEW_POST_FULFILLED') {
    return {
      ...state,
      loading: false,
      errorMessage: ''
    }
  }
  if (action.type === 'VOTE_FEED_POST_FULFILLED') {
    const {voteInfo} = action.payload.data
    return {
      ...state,
      loading: false,
      posts: state.posts.map(
        (post, i) => {
          return (post.postHash === voteInfo.postHash ? {
            ...post,
            postVoteCountInfo: voteInfo.postVoteCountInfo,
            requestorVoteCountInfo: voteInfo.requestorVoteCountInfo
          } : post
          )
        }
      )
    }
  }

  if (action.type === 'VOTE_FEED_POST_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'VOTE_FEED_POST_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload.data.message.errorCode
    }
  }

  if (action.type === 'GET_VOTE_COST_ESTIMATE_FULFILLED') {
    return {
      ...state,
      fetchingVoteCost: false,
      voteInfo: action.payload,
      voteInfoError: null
    }
  }
  if (action.type === 'GET_VOTE_COST_ESTIMATE_PENDING') {
    return {
      ...state,
      fetchingVoteCost: true,
      voteInfoError: null
    }
  }
  if (action.type === 'GET_VOTE_COST_ESTIMATE_REJECTED') {
    return {
      ...state,
      fetchingVoteCost: false,
      voteInfoError: action.payload.data.message.errorCode
    }
  }

  if (action.type === 'RESET_ERROR_MESSAGE') {
    return {
      ...state,
      errorMessage: ''
    }
  }

  if (action.type === 'UPDATE_TARGET_POST_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'UPDATE_TARGET_POST_FULFILLED') {
    return {
      ...state,
      loading: false,
      posts: state.posts.map(post => {
        if (post.postHash === action.payload.postHash) {
          return {
            ...post,
            ...action.payload
          }
        }
        return post
      })
    }
  }
  if (action.type === 'UPDATE_TARGET_POST_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload.errorCode
    }
  }
  return state
}
