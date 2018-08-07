import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostDetail from '../../stories/screens/PostDetail'
import { getReplies, fetchUserMilstoneData, processPutOption, clearPostDetail } from './actions'

class PostDetailContainer extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      post: this.props.navigation.getParam('post', null)
    })
  }

  componentWillMount () {
    this.props.clearPostDetail()
    this.props.getReplies(this.state.post.postHash)
    if (this.state.post.postType === 'MILESTONE') {
      this.props.fetchUserMilstoneData(this.state.post.postHash)
    }
  }
  render () {
    return (
      <PostDetail
        navigation={this.props.navigation}
        post={this.state.post}
        replies={this.props.replies}
        loading={this.props.loading}
        errorMessage={this.props.errorMessage}
        milestoneData={this.props.milestoneData}
        processPutOption={this.props.processPutOption}
        getReplies={this.props.getReplies}
      />
    )
  }
}

const mapStateToProps = state => ({
  replies: state.postDetailReducer.replies,
  loading: state.postDetailReducer.loading,
  errorMessage: state.postDetailReducer.errorMessage,
  milestoneData: state.postDetailReducer.milestoneData
})

const mapDispatchToProps = (dispatch) => ({
  getReplies: (postHash) => dispatch(getReplies(postHash)),
  fetchUserMilstoneData: (postHash) => dispatch(fetchUserMilstoneData(postHash)),
  processPutOption: (postHash, numToken, numVtxFeeToken, action) => dispatch(processPutOption(postHash, numToken, numVtxFeeToken, action)),
  clearPostDetail: () => dispatch(clearPostDetail())
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailContainer)
