import React, { Component } from 'react'
import { connect } from 'react-redux'
import Discover from '../../stories/screens/Discover'
import { refreshPosts, getMorePosts, switchBoard, newPost } from './actions'

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
      />
    )
  }
}

const mapStateToProps = state => ({
  posts: state.discoverReducer.posts,
  loading: state.discoverReducer.loading,
  boardHash: state.discoverReducer.boardHash,
  boardName: state.discoverReducer.boardName,
  errorMessage: state.discoverReducer.errorMessage
})

const mapDispatchToProps = (dispatch) => ({
  refreshPosts: (boardHash) => dispatch(refreshPosts('board', boardHash)),
  getMorePosts: (boardHash) => dispatch(getMorePosts('board', boardHash)),
  switchBoard: (boardHash, boardName) => dispatch(switchBoard(boardHash, boardName)),
  newPost: (content, boardId, parentHash, postType, destination) => dispatch(newPost(content, boardId, parentHash, postType, destination))
})

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverContainer)
