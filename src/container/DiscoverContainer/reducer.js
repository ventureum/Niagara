import update from 'immutability-helper'

const initialState = {
  publicToken: 'W85ESUVxvR-TMzhuEy9XHfcyXD8',
  userToken: 'L2M8l4ojjkqKxN8S7PI1LGW5Dw0',
  timelineToken: 'fsh3kUxs-m03lLPqGTB5DVtn1Cw',
  posts: [],
  offset: 0
}

export default function (state: any = initialState, action: Function) {
  if (action.type === 'SET_TOKENS') {
    return {
      ...state,
      publicToken: action.public,
      userToken: action.user,
      timelineToken: action.timeline
    }
  }
  if (action.type === 'REFRESH_POSTS_FULFILLED') {
    return {
      ...state,
      posts: action.payload.results,
      offset: 0
    }
  }

  if (action.type === 'GET_MORE_POSTS_FULFILLED') {
    return update(
      update(
        state,
        {posts: {$push: action.payload.results}}
      ),
      {offset: {$set: action.meta.offset}}
    )
  }
  return state
}
