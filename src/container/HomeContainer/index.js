import React, { Component } from 'react'
import { connect } from 'react-redux'
import Home from '../../stories/screens/Home'
import {
  refreshPosts,
  getMorePosts,
  newPost,
  voteFeedPost,
  resetErrorMessage,
  setCurrentParentPost
} from '../../actions'

class HomeContainer extends Component {
  constructor (props) {
    super(props)
    this.props.refreshPosts(this.props.actor, 'homePosts')
  }

  render () {
    return (
      <Home navigation={this.props.navigation}
        actor={this.props.actor}
        homePosts={this.props.homePosts}
        refreshPosts={this.props.refreshPosts}
        getMorePosts={this.props.getMorePosts}
        homePostsLoading={this.props.homePostsLoading}
        errorMessage={this.props.errorMessage}
        voteFeedPost={this.props.voteFeedPost}
        setCurrentParentPost={this.props.setCurrentParentPost}
        resetErrorMessage={this.props.resetErrorMessage}
      />
    )
  }
}

const mapStateToProps = ({profileReducer, forumReducer}) => ({
  homePosts: forumReducer.homePosts,
  homePostsLoading: forumReducer.homePostsLoading,
  errorMessage: forumReducer.errorMessage,
  actor: profileReducer.profile.actor
})

const mapDispatchToProps = (dispatch) => ({
  refreshPosts: (actor, targetArray) => dispatch(refreshPosts('user', actor, targetArray)),
  getMorePosts: (actor, targetArray) => dispatch(getMorePosts('user', actor, targetArray)),
  newPost: (content, boardId, parentHash, postType, destination) =>
    dispatch(newPost(content, boardId, parentHash, postType, destination)),
  voteFeedPost: (postHash, value) => dispatch(voteFeedPost(postHash, value)),
  setCurrentParentPost: (postHash, targetArray) => dispatch(setCurrentParentPost(postHash, targetArray)),
  resetErrorMessage: () => dispatch(resetErrorMessage())
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer)
