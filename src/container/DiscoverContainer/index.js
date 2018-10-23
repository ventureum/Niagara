import React, { Component } from 'react'
import { connect } from 'react-redux'
import Discover from '../../stories/screens/Discover'
import {
  refreshPosts,
  getMorePosts,
  switchBoard,
  newPost,
  voteFeedPost,
  resetErrorMessage,
  setCurrentParentPost,
  getUserFollowing
} from '../../actions'
import { POPULAR_RANKING } from '../../utils/constants'

class DiscoverContainer extends Component {
  componentWillMount () {
    this.refreshPosts()
  }

  refreshPosts = () => {
    const { boardId } = this.props
    this.props.refreshPosts('board', boardId, 'popularPosts', POPULAR_RANKING)
    this.props.refreshPosts('board', boardId, 'newPosts')
    this.props.getUserFollowing()
  }

  render () {
    return (
      <Discover navigation={this.props.navigation}
        popularPosts={this.props.popularPosts}
        newPosts={this.props.newPosts}
        refreshPosts={this.refreshPosts}
        getMorePosts={this.props.getMorePosts}
        loading={this.props.loading}
        newPostsLoading={this.props.newPostsLoading}
        popularPostsLoading={this.props.popularPostsLoading}
        boardId={this.props.boardId}
        boardName={this.props.boardName}
        newPost={this.props.newPost}
        errorMessage={this.props.errorMessage}
        setCurrentParentPost={this.props.setCurrentParentPost}
        resetErrorMessage={this.props.resetErrorMessage}
        getUserFollowing={this.props.getUserFollowing}
        userFollowing={this.props.userFollowing}
        groupsLoading={this.props.groupsLoading}
      />
    )
  }
}

const mapStateToProps = ({forumReducer}) => ({
  newPosts: forumReducer.newPosts,
  popularPosts: forumReducer.popularPosts,
  loading: forumReducer.loading,
  newPostsLoading: forumReducer.newPostsLoading,
  homePostsLoading: forumReducer.homePostsLoading,
  popularPostsLoading: forumReducer.popularPostsLoading,
  boardId: forumReducer.boardId,
  boardName: forumReducer.boardName,
  errorMessage: forumReducer.errorMessage,
  userFollowing: forumReducer.userFollowing,
  groupsLoading: forumReducer.groupsLoading
})

const mapDispatchToProps = (dispatch) => ({
  refreshPosts: (feedSlug, boardId, targetArray, ranking) => dispatch(refreshPosts(feedSlug, boardId, targetArray, ranking)),
  getMorePosts: (feedSlug, boardId, targetArray, ranking) => dispatch(getMorePosts(feedSlug, boardId, targetArray, ranking)),
  switchBoard: (boardId, boardName) => dispatch(switchBoard(boardId, boardName)),
  newPost: (content, boardId, parentHash, postType, destination) => dispatch(newPost(content, boardId, parentHash, postType, destination)),
  voteFeedPost: (postHash, value) => dispatch(voteFeedPost(postHash, value)),
  setCurrentParentPost: (postHash, targetArray) => dispatch(setCurrentParentPost(postHash, targetArray)),
  resetErrorMessage: () => dispatch(resetErrorMessage()),
  getUserFollowing: () => dispatch(getUserFollowing())
})

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverContainer)
