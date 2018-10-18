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
  setCurrentParentPost
} from '../../actions'
import { POPULAR_RANKING } from '../../utils/constants'

class DiscoverContainer extends Component {
  componentWillMount () {
    this.refreshPosts()
  }

  refreshPosts = () => {
    const { boardHash } = this.props
    this.props.refreshPosts('board', boardHash, 'popularPosts', POPULAR_RANKING)
    this.props.refreshPosts('board', boardHash, 'newPosts')
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
        boardHash={this.props.boardHash}
        boardName={this.props.boardName}
        newPost={this.props.newPost}
        errorMessage={this.props.errorMessage}
        setCurrentParentPost={this.props.setCurrentParentPost}
        resetErrorMessage={this.props.resetErrorMessage}
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
  boardHash: forumReducer.boardHash,
  boardName: forumReducer.boardName,
  errorMessage: forumReducer.errorMessage
})

const mapDispatchToProps = (dispatch) => ({
  refreshPosts: (feedSlug, boardHash, targetArray, ranking) => dispatch(refreshPosts(feedSlug, boardHash, targetArray, ranking)),
  getMorePosts: (feedSlug, boardHash, targetArray, ranking) => dispatch(getMorePosts(feedSlug, boardHash, targetArray, ranking)),
  switchBoard: (boardHash, boardName) => dispatch(switchBoard(boardHash, boardName)),
  newPost: (content, boardId, parentHash, postType, destination) => dispatch(newPost(content, boardId, parentHash, postType, destination)),
  voteFeedPost: (postHash, value) => dispatch(voteFeedPost(postHash, value)),
  setCurrentParentPost: (postHash, targetArray) => dispatch(setCurrentParentPost(postHash, targetArray)),
  resetErrorMessage: () => dispatch(resetErrorMessage())
})

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverContainer)
