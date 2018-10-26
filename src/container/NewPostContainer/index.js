import React, { Component } from 'react'
import NewPost from '../../stories/screens/NewPost'
import WalletUtils from '../../utils/wallet'
import { newPost } from '../../actions'
import { connect } from 'react-redux'

class NewPostContainer extends Component {
  render () {
    const boardId = this.props.navigation.getParam('boardId')
    const refreshCallback = this.props.navigation.getParam('refreshCallback', () => {})
    return (
      <NewPost
        navigation={this.props.navigation}
        avatar={WalletUtils.getAvatar()}
        newPost={this.props.newPost}
        boardId={boardId}
        refreshCallback={refreshCallback}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  newPost: (content, boardId, parentHash, postType, destination, refreshCallback) =>
    dispatch(newPost(content, boardId, parentHash, postType, destination, refreshCallback))
})

export default connect(null, mapDispatchToProps)(NewPostContainer)
