import React, { Component } from 'react'
import { connect } from 'react-redux'
import BoardDetail from '../../stories/screens/BoardDetail'
import {
  refreshPosts,
  getMorePosts,
  resetErrorMessage,
  setCurrentParentPost,
  clearBoardDetail
} from '../../actions'

class BoardDetailContainer extends Component {
  componentWillMount () {
    this.props.clearBoardDetail()
    this.refreshPosts()
  }

  refreshPosts = () => {
    const { boardId } = this.props.navigation.getParam('board', '')
    this.props.refreshPosts(boardId, 'boardPosts')
  }

  render () {
    const board = this.props.navigation.getParam('board', '')
    return (
      <BoardDetail navigation={this.props.navigation}
        board={board}
        boardPosts={this.props.boardPosts}
        refreshPosts={this.refreshPosts}
        getMorePosts={this.props.getMorePosts}
        boardPostsLoading={this.props.boardPostsLoading}
        errorMessage={this.props.errorMessage}
        setCurrentParentPost={this.props.setCurrentParentPost}
        resetErrorMessage={this.props.resetErrorMessage}
      />
    )
  }
}

const mapStateToProps = ({ profileReducer, forumReducer }) => ({
  boardPosts: forumReducer.boardPosts,
  boardPostsLoading: forumReducer.boardPostsLoading,
  errorMessage: forumReducer.errorMessage,
  actor: profileReducer.profile.actor
})

const mapDispatchToProps = (dispatch) => ({
  refreshPosts: (boardId, targetArray) => dispatch(refreshPosts('board', boardId, targetArray)),
  getMorePosts: (boardId, targetArray) => dispatch(getMorePosts('board', boardId, targetArray)),
  setCurrentParentPost: (postHash, targetArray) => dispatch(setCurrentParentPost(postHash, targetArray)),
  resetErrorMessage: () => dispatch(resetErrorMessage()),
  clearBoardDetail: () => dispatch(clearBoardDetail())
})

export default connect(mapStateToProps, mapDispatchToProps)(BoardDetailContainer)
