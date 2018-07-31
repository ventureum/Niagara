import React, { Component } from 'react'
import NewPost from '../../stories/screens/NewPost'
import WalletUtils from '../../utils/wallet'
import { newPost } from '../DiscoverContainer/actions'
import { connect } from 'react-redux'

class NewPostContainer extends Component {
  render () {
    const boardHash = this.props.navigation.getParam('boardHash')
    return (
      <NewPost
        navigation={this.props.navigation}
        avatar={WalletUtils.getAvatar()}
        newPost={this.props.newPost}
        boardHash={boardHash}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  newPost: (content, boardId, parentHash, postType, destination) => dispatch(newPost(content, boardId, parentHash, postType, destination))
})

export default connect(null, mapDispatchToProps)(NewPostContainer)
