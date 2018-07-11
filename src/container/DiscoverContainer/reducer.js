import update from 'immutability-helper'

const initialState = {
  boardHash: 'all',
  boardName: 'Feed',
  posts: [],
  lastUUID: '',
  replies: [],
  loading: false,
  ipfsPath: ''
}

export default function (state: any = initialState, action: Function) {
  if (action.type === 'REFRESH_POSTS_FULFILLED') {
    const length = action.payload.length
    if (length === 0) {
      return {
        ...state,
        loading: false,
        posts: []
      }
    }
    return {
      ...state,
      posts: action.payload,
      lastUUID: action.payload[length - 1].id,
      loading: false
    }
  }

  if (action.type === 'REFRESH_POSTS_PENDING') {
    return {
      ...state,
      loading: true
    }
  }

  if (action.type === 'GET_MORE_POSTS_FULFILLED') {
    const length = action.payload.length
    if (length === 0) {
      return {
        ...state,
        loading: false
      }
    }
    return update(
      update(
        update(
          state,
          { posts: { $push: action.payload } }
        ),
        { lastUUID: { $set: action.payload[length - 1].id } }
      ),
      { loading: { $set: false } }
    )
  }
  if (action.type === 'GET_REPLIES_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'GET_REPLIES_FULFILLED') {
    return {
      ...state,
      loading: false,
      replies: action.payload
    }
  }
  if (action.type === 'ADD_CONTENT_TO_IPFS_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'ADD_CONTENT_TO_IPFS_FULFILLED') {
    return {
      ...state,
      ipfsPath: action.payload
    }
  }
  if (action.type === 'ADD_POST_TO_FORUM_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'ADD_POST_TO_FORUM_FULFILLED') {
    return {
      ...state,
      loading: false
    }
  }
  if (action.type === 'SWITCH_BOARD') {
    return {
      ...state,
      boardHash: action.meta.boardHash,
      boardName: action.meta.boardName,
      posts: []
    }
  }
  return state
}
