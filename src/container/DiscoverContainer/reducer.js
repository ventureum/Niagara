import update from 'immutability-helper'
import { BOARD_ALL_HASH } from '../../utils/constants.js'

const initialState = {
  boardHash: BOARD_ALL_HASH,
  boardName: 'All',
  posts: [],
  lastUUID: '',
  replies: [],
  loading: false,
  ipfsPath: '',
  errorMessage: ''
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
      errorMessage: action.payload
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
      {errorMessage: {$set: ''}}
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
      errorMessage: action.payload
    }
  }

  if (action.type === 'NEW_POST_FULFILLED') {
    return {
      ...state,
      loading: false,
      errorMessage: ''
    }
  }
  if (action.type === 'UPDATE_POST_REWARDS_FULFILLED') {
    return {
      ...state,
      loading: false
    }
  }
  if (action.type === 'UPDATE_POST_REWARDS_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'UPDATE_POST_REWARDS_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload
    }
  }
  return state
}
