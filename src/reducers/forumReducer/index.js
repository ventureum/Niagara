import update from 'immutability-helper'
import { BOARD_ALL_HASH } from '../../utils/constants.js'

const initialState = {
  boardHash: BOARD_ALL_HASH,
  boardName: 'All',
  posts: [],
  lastUUID: '',
  loading: false,
  errorMessage: '',
  currentParentPostHash: '',
  replies: [],
  milestoneData: {},
  milestoneDataLoading: false
}

export default function (state = initialState, action) {
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

  if (action.type === 'GET_REPLIES_PENDING') {
    return {
      ...state,
      loading: true,
      errorMessage: ''
    }
  }
  if (action.type === 'GET_REPLIES_FULFILLED') {
    return {
      ...state,
      loading: false,
      replies: action.payload,
      errorMessage: ''
    }
  }
  if (action.type === 'GET_REPLIES_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload
    }
  }

  if (action.type === 'FETCH_USER_MILESTONE_DATA_FULFILLED') {
    return {
      ...state,
      milestoneDataLoading: false,
      errorMessage: '',
      milestoneData: action.payload
    }
  }
  if (action.type === 'FETCH_USER_MILESTONE_DATA_PENDING') {
    return {
      ...state,
      milestoneDataLoading: true,
      errorMessage: ''
    }
  }
  if (action.type === 'FETCH_USER_MILESTONE_DATA_REJECTED') {
    return {
      ...state,
      milestoneDataLoading: false,
      errorMessage: action.payload
    }
  }
  if (action.type === 'CLEAR_POST_DETAIL') {
    return {
      ...state,
      replies: [],
      currentParentPostHash: state.currentParentPostHash
    }
  }

  if (action.type === 'PROCESS_PUT_OPTION_FULFILLED') {
    return {
      ...state,
      milestoneDataLoading: false
    }
  }
  if (action.type === 'PROCESS_PUT_OPTION_PENDING') {
    return {
      ...state,
      milestoneDataLoading: true
    }
  }
  if (action.type === 'PROCESS_PUT_OPTION_REJECTED') {
    return {
      ...state,
      milestoneDataLoading: false,
      errorMessage: action.payload
    }
  }

  if (action.type === 'VOTE_FEED_REPLY_FULFILLED') {
    const { voteInfo } = action.payload.data
    return {
      ...state,
      loading: false,
      replies: state.replies.map(
        (reply) => {
          return (reply.postHash === voteInfo.postHash ? {
            ...reply,
            postVoteCountInfo: voteInfo.postVoteCountInfo,
            requestorVoteCountInfo: voteInfo.requestorVoteCountInfo
          } : reply
          )
        }
      )
    }
  }
  if (action.type === 'VOTE_FEED_REPLY_PENDING') {
    return {
      ...state,
      loading: true
    }
  }
  if (action.type === 'VOTE_FEED_REPLY_REJECTED') {
    return {
      ...state,
      loading: false,
      errorMessage: action.payload
    }
  }

  if (action.type === 'SET_CURRENT_PARENT_POST_HASH') {
    return {
      ...state,
      currentParentPostHash: action.payload
    }
  }
  return state
}
