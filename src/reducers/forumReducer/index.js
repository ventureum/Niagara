import { BOARD_ALL_HASH } from '../../utils/constants.js'
import boardsData from '../../utils/boards.json'

const initialState = {
  boardId: BOARD_ALL_HASH,
  boardName: 'All',
  newPosts: {
    loading: false,
    next: {},
    posts: []
  },
  homePosts: {
    loading: false,
    next: {},
    posts: []
  },
  popularPosts: {
    loading: false,
    next: {},
    posts: []
  },
  loading: false,
  errorMessage: '',
  currentParentPost: {},
  replies: {
    loading: false,
    posts: [],
    next: {}
  },
  milestoneData: {},
  milestoneDataLoading: false,
  userFollowing: {
    loading: false,
    following: []
  },
  boardPosts: {
    loading: false,
    next: {},
    posts: []
  },
  boards: boardsData.boards
}

export default function (state = initialState, action) {
  if (action.type === 'REFRESH_POSTS_FULFILLED') {
    const { targetArray } = action.meta
    return {
      ...state,
      [`${targetArray}`]: {
        ...action.payload,
        loading: false
      },
      errorMessage: ''
    }
  }

  if (action.type === 'REFRESH_POSTS_PENDING') {
    const { targetArray } = action.meta
    return {
      ...state,
      [`${targetArray}`]: {
        ...state[targetArray],
        loading: true
      },
      errorMessage: ''
    }
  }
  if (action.type === 'REFRESH_POSTS_REJECTED') {
    const { targetArray } = action.meta
    return {
      ...state,
      [`${targetArray}`]: {
        ...state[targetArray],
        loading: false
      },
      errorMessage: action.payload.data.message.errorCode
    }
  }

  if (action.type === 'GET_MORE_POSTS_FULFILLED') {
    const { targetArray } = action.meta
    const newArray = state[targetArray].posts.concat(action.payload.posts)
    return {
      ...state,
      [`${targetArray}`]: {
        posts: newArray,
        loading: false,
        next: action.payload.next
      },
      errorMessage: ''
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
    const { voteInfo } = action.payload.data
    const { targetArray } = state.currentParentPost
    return {
      ...state,
      loading: false,
      [targetArray]: {
        ...state[targetArray],
        loading: false,
        posts: state[targetArray].posts.map(
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
  }

  if (action.type === 'VOTE_FEED_POST_PENDING') {
    const { targetArray } = state.currentParentPost
    return {
      ...state,
      [`${targetArray}`]: {
        ...state[targetArray],
        loading: true
      }
    }
  }
  if (action.type === 'VOTE_FEED_POST_REJECTED') {
    const { targetArray } = state.currentParentPost
    return {
      ...state,
      [`${targetArray}`]: {
        ...state[targetArray],
        loading: false
      },
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
      [targetArray]: {
        ...state[targetArray],
        loading: false,
        posts: state[targetArray].posts.map(post => {
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
  }
  if (action.type === 'UPDATE_TARGET_POST_REJECTED') {
    const { targetArray } = action.meta
    return {
      ...state,
      [`${targetArray}`]: {
        ...state[targetArray],
        loading: false
      },
      errorMessage: action.payload.errorCode
    }
  }

  if (action.type === 'GET_REPLIES_PENDING') {
    return {
      ...state,
      replies: {
        ...state.replies,
        loading: true
      },
      errorMessage: ''
    }
  }
  if (action.type === 'GET_REPLIES_FULFILLED') {
    return {
      ...state,
      loading: false,
      replies: {
        ...action.payload,
        loading: false
      },
      errorMessage: ''
    }
  }
  if (action.type === 'GET_REPLIES_REJECTED') {
    return {
      ...state,
      replies: {
        ...state.replies,
        loading: false
      },
      errorMessage: action.payload
    }
  }

  if (action.type === 'GET_MORE_REPLIES_PENDING') {
    return {
      ...state,
      replies: {
        ...state.replies,
        loading: true
      },
      errorMessage: ''
    }
  }
  if (action.type === 'GET_MORE_REPLIES_FULFILLED') {
    const newArray = state.replies.posts.concat(action.payload.posts)
    return {
      ...state,
      loading: false,
      replies: {
        posts: newArray,
        loading: false,
        next: action.payload.next
      },
      errorMessage: ''
    }
  }
  if (action.type === 'GET_MORE_REPLIES_REJECTED') {
    return {
      ...state,
      replies: {
        ...state.replies,
        loading: false
      },
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
      replies: {
        loading: false,
        posts: [],
        next: ''
      },
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
      replies: {
        posts: state.replies.posts.map(
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
  }
  if (action.type === 'VOTE_FEED_REPLY_PENDING') {
    return {
      ...state,
      replies: {
        ...state.replies,
        loading: true
      }
    }
  }
  if (action.type === 'VOTE_FEED_REPLY_REJECTED') {
    return {
      ...state,
      replies: {
        ...state.replies,
        loading: false
      },
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
      userFollowing: {
        ...state.userFollowing,
        loading: true
      }
    }
  }
  if (action.type === 'GET_USER_FOLLOWING_REJECTED') {
    return {
      ...state,
      userFollowing: {
        ...state.userFollowing,
        loading: false
      },
      errorMessage: action.payload
    }
  }
  if (action.type === 'GET_USER_FOLLOWING_FULFILLED') {
    return {
      ...state,
      userFollowing: {
        following: action.payload,
        loading: false
      }
    }
  }

  if (action.type === 'CLEAR_BOARD_DETAIL') {
    return {
      ...state,
      boardPosts: {
        loading: false,
        next: '',
        posts: []
      }
    }
  }
  return state
}
