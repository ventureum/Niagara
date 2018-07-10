import React, { Component } from 'react'
import { connect } from 'react-redux'
import Reply from '../../stories/screens/Reply'
import { getReplies, _addContentToIPFS, _addPostToForum } from '../DiscoverContainer/actions'

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
        ipfsPath={this.props.ipfsPath}
      />
    )
  }
}

const mapStateToProps = state => ({
  replies: state.discoverReducer.replies,
  loading: state.discoverReducer.loading,
  ipfsPath: state.discoverReducer.ipfsPath
})

const mapDispatchToProps = (dispatch) => ({
  getReplies: (postHash) => dispatch(getReplies(postHash)),
  addContentToIPFS: (content) => dispatch(_addContentToIPFS(content)),
  addPostToForum: (boardId, parentHash, postHash, ipfsPath) => dispatch(_addPostToForum(boardId, parentHash, postHash, ipfsPath))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReplyContainer)
