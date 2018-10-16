import React, { Component } from 'react'
import { connect } from 'react-redux'
import Reply from '../../stories/screens/Reply'
import { newPost } from '../../actions'

class ReplyContainer extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      post: this.props.navigation.getParam('post', null)
    })
  }

  render () {
    return (
      <Reply
        navigation={this.props.navigation}
        post={this.state.post}
        loading={this.props.loading}
        newPost={this.props.newPost}
        errorMessage={this.props.errorMessage}
        boardHash={this.props.boardHash}
      />
    )
  }
}

const mapStateToProps = state => ({
  loading: state.forumReducer.loading,
  errorMessage: state.forumReducer.errorMessage,
  boardHash: state.forumReducer.boardHash
})

const mapDispatchToProps = (dispatch) => ({
  newPost: (content, boardId, parentHash, postType, destination) => dispatch(newPost(content, boardId, parentHash, postType, destination))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReplyContainer)
