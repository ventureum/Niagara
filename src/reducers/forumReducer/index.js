import update from 'immutability-helper'
import { BOARD_ALL_HASH } from '../../utils/constants.js'

const initialState = {
  boardHash: BOARD_ALL_HASH,
  boardName: 'All',
  newPosts: [],
  homePosts: [],
  popularPosts: [],
  lastUUID: '',
  newPostsLoading: false,
  homePostsLoading: false,
  popularPostsLoading: false,
  loading: false,
  errorMessage: '',
  currentParentPost: {},
  replies: [],
  milestoneData: {},
  milestoneDataLoading: false,
  userFollowing: []
}

export default function (state = initialState, action) {
  if (action.type === 'REFRESH_POSTS_FULFILLED') {
    const length = action.payload.length
    const { targetArray } = action.meta
    if (length === 0) {
      return {
        ...state,
        [`${targetArray}Loading`]: false,
        [targetArray]: [],
        errorMessage: ''
      }
    }
    return {
      ...state,
      [targetArray]: action.payload,
      lastUUID: action.payload[length - 1].id,
      [`${targetArray}Loading`]: false,
      errorMessage: ''
    }
  }

  if (action.type === 'REFRESH_POSTS_PENDING') {
    const { targetArray } = action.meta
    return {
      ...state,
      [`${targetArray}Loading`]: true,
      errorMessage: ''
    }
  }
  if (action.type === 'REFRESH_POSTS_REJECTED') {
    const { targetArray } = action.meta
    return {
      ...state,
      [`${targetArray}Loading`]: false,
      errorMessage: action.payload.data.message.errorCode
    }
  }
  if (action.type === 'GET_MORE_POSTS_FULFILLED') {
    const length = action.payload.length
    const { targetArray } = action.meta
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
            { [targetArray]: { $push: action.payload } }
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
    const { voteInfo } = action.payload.data
    const { targetArray } = state.currentParentPost
    return {
      ...state,
      loading: false,
      [targetArray]: state[targetArray].map(
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
    const { targetArray } = action.meta
    return {
      ...state,
      loading: false,
      [targetArray]: state[targetArray].map(post => {
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
      currentParentPost: state.currentParentPost
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
      errorMessage: action.payload.data.message.errorCode
    }
  }

  if (action.type === 'SET_CURRENT_PARENT_POST') {
    return {
      ...state,
      currentParentPost: action.payload
    }
  }

  if (action.type === 'GET_USER_FOLLOWING_PENDING') {
    return {
      ...state,
      groupsLoading: true
    }
  }
  if (action.type === 'GET_USER_FOLLOWING_REJECTED') {
    return {
      ...state,
      groupsLoading: false,
      errorMessage: action.payload
    }
  }
  if (action.type === 'GET_USER_FOLLOWING_FULFILLED') {
    return {
      ...state,
      groupsLoading: false,
      userFollowing: action.payload
    }
  }
  return state
}
