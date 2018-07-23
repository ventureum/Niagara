import React, { Component } from 'react'
import { connect } from 'react-redux'
import Reply from '../../stories/screens/Reply'
import { getReplies, newPost } from '../DiscoverContainer/actions'

class ReplyContainer extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      post: this.props.navigation.getParam('post', null)
    })
  }

  componentWillMount () {
    this.props.getReplies(this.state.post.hash)
  }
  render () {
    return (
      <Reply post={this.state.post}
        replies={this.props.replies}
        addContentToIPFS={this.props.addContentToIPFS}
        addPostToForum={this.props.addPostToForum}
        loading={this.props.loading}
        newPost={this.props.newPost}
        errorMessage={this.props.errorMessage}
      />
    )
  }
}

const mapStateToProps = state => ({
  replies: state.discoverReducer.replies,
  loading: state.discoverReducer.loading,
  errorMessage: state.discoverReducer.errorMessage
})

const mapDispatchToProps = (dispatch) => ({
  getReplies: (postHash) => dispatch(getReplies(postHash)),
  newPost: (content, boardId, parentHash, postType) => dispatch(newPost(content, boardId, parentHash, postType))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReplyContainer)
