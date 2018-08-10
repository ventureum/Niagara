import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostDetail from '../../stories/screens/PostDetail'
import { getReplies, fetchUserMilstoneData, processPutOption, clearPostDetail } from './actions'
import { updatePostRewards } from '../DiscoverContainer/actions'

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
        milestoneDataLoading={this.props.milestoneDataLoading}
        fetchUserMilstoneData={this.props.fetchUserMilstoneData}
        updatePostRewards={this.props.updatePostRewards}
      />
    )
  }
}

const mapStateToProps = state => ({
  replies: state.postDetailReducer.replies,
  loading: state.postDetailReducer.loading,
  errorMessage: state.postDetailReducer.errorMessage,
  milestoneData: state.postDetailReducer.milestoneData,
  milestoneDataLoading: state.postDetailReducer.milestoneDataLoading
})

const mapDispatchToProps = (dispatch) => ({
  getReplies: (postHash) => dispatch(getReplies(postHash)),
  fetchUserMilstoneData: (postHash) => dispatch(fetchUserMilstoneData(postHash)),
  processPutOption: (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, refreshCallback) =>
    dispatch(processPutOption(postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, refreshCallback)),
  clearPostDetail: () => dispatch(clearPostDetail()),
  updatePostRewards: (boardId, postHash, value) => dispatch(updatePostRewards(boardId, postHash, value))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailContainer)
