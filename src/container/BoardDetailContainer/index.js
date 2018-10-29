import React, { Component } from 'react'
import { connect } from 'react-redux'
import BoardDetail from '../../stories/screens/BoardDetail'
import {
  refreshPosts,
  getMorePosts,
  resetErrorMessage,
  setCurrentParentPost,
  clearBoardDetail,
  followBoards,
  unfollowBoards
} from '../../actions'

class BoardDetailContainer extends Component {
  componentWillMount () {
    this.props.clearBoardDetail()
    this.refreshPosts()
  }

  refreshPosts = () => {
    const { boardId } = this.props.navigation.getParam('board', '')
    this.props.refreshPosts('board', boardId, 'boardPosts')
  }

  getMorePosts = () => {
    const board = this.props.navigation.getParam('board', '')
    this.props.getMorePosts('board', board.boardId, 'boardPosts')
  }
  render () {
    const board = this.props.navigation.getParam('board', '')
    return (
      <BoardDetail navigation={this.props.navigation}
        board={board}
        boardPosts={this.props.boardPosts}
        refreshPosts={this.refreshPosts}
        getMorePosts={this.getMorePosts}
        errorMessage={this.props.errorMessage}
        setCurrentParentPost={this.props.setCurrentParentPost}
        resetErrorMessage={this.props.resetErrorMessage}
        userFollowing={this.props.userFollowing}
        followBoards={this.props.followBoards}
        unfollowBoards={this.props.unfollowBoards}
      />
    )
  }
}

const mapStateToProps = ({ profileReducer, forumReducer }) => ({
  boardPosts: forumReducer.boardPosts,
  errorMessage: forumReducer.errorMessage,
  actor: profileReducer.profile.actor,
  userFollowing: forumReducer.userFollowing
})

const mapDispatchToProps = (dispatch) => ({
  refreshPosts: (feedSlug, boardId, targetArray) => dispatch(refreshPosts(feedSlug, boardId, targetArray)),
  getMorePosts: (feedSlug, boardId, targetArray) => dispatch(getMorePosts(feedSlug, boardId, targetArray)),
  setCurrentParentPost: (postHash, targetArray) => dispatch(setCurrentParentPost(postHash, targetArray)),
  resetErrorMessage: () => dispatch(resetErrorMessage()),
  clearBoardDetail: () => dispatch(clearBoardDetail()),
  followBoards: (boardIds) => dispatch(followBoards(boardIds)),
  unfollowBoards: (boardIds) => dispatch(unfollowBoards(boardIds))
})

export default connect(mapStateToProps, mapDispatchToProps)(BoardDetailContainer)
