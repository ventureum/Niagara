import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostDetail from '../../stories/screens/PostDetail'
import { getReplies } from '../DiscoverContainer/actions'

class ReplyContainer extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      post: this.props.navigation.getParam('post', null)
    })
  }

  componentWillMount () {
    this.props.getReplies(this.state.post.postHash)
  }
  render () {
    return (
      <PostDetail
        navigation={this.props.navigation}
        post={this.state.post}
        replies={this.props.replies}
        loading={this.props.loading}
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
  getReplies: (postHash) => dispatch(getReplies(postHash))
})

export default connect(mapStateToProps, mapDispatchToProps)(ReplyContainer)
