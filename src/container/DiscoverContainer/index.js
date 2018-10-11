import React, { Component } from 'react'
import { connect } from 'react-redux'
import Discover from '../../stories/screens/Discover'
import { setCurrentParentPost } from '../PostDetailContainer/actions'
import {
  refreshPosts,
  getMorePosts,
  switchBoard,
  newPost,
  voteFeedPost,
  getVoteCostEstimate,
  resetErrorMessage
} from './actions'

class DiscoverContainer extends Component {
  constructor (props) {
    super(props)
    this.props.refreshPosts(this.props.boardHash)
  }

  render () {
    return (
      <Discover navigation={this.props.navigation}
        posts={this.props.posts}
        refreshPosts={this.props.refreshPosts}
        getMorePosts={this.props.getMorePosts}
        loading={this.props.loading}
        switchBoard={this.props.switchBoard}
        boardHash={this.props.boardHash}
        boardName={this.props.boardName}
        newPost={this.props.newPost}
        errorMessage={this.props.errorMessage}
        voteFeedPost={this.props.voteFeedPost}
        getVoteCostEstimate={this.props.getVoteCostEstimate}
        fetchingVoteCost={this.props.fetchingVoteCost}
        voteInfo={this.props.voteInfo}
        voteInfoError={this.props.voteInfoError}
        setCurrentParentPost={this.props.setCurrentParentPost}
        resetErrorMessage={this.props.resetErrorMessage}
      />
    )
  }
}

const mapStateToProps = state => ({
  posts: state.discoverReducer.posts,
  loading: state.discoverReducer.loading,
  boardHash: state.discoverReducer.boardHash,
  boardName: state.discoverReducer.boardName,
  errorMessage: state.discoverReducer.errorMessage,
  fetchingVoteCost: state.discoverReducer.fetchingVoteCost,
  voteInfo: state.discoverReducer.voteInfo,
  voteInfoError: state.discoverReducer.voteInfoError
})

const mapDispatchToProps = (dispatch) => ({
  refreshPosts: (boardHash) => dispatch(refreshPosts('board', boardHash)),
  getMorePosts: (boardHash) => dispatch(getMorePosts('board', boardHash)),
  switchBoard: (boardHash, boardName) => dispatch(switchBoard(boardHash, boardName)),
  newPost: (content, boardId, parentHash, postType, destination) => dispatch(newPost(content, boardId, parentHash, postType, destination)),
  voteFeedPost: (postHash, value) => dispatch(voteFeedPost(postHash, value)),
  getVoteCostEstimate: (postHash) => dispatch(getVoteCostEstimate(postHash)),
  setCurrentParentPost: (post) => dispatch(setCurrentParentPost(post)),
  resetErrorMessage: () => dispatch(resetErrorMessage())
})

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverContainer)
