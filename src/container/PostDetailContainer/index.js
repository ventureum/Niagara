import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostDetail from '../../stories/screens/PostDetail'
import { getReplies, fetchUserMilstoneData, processPutOption, clearPostDetail, voteFeedPost } from './actions'
import { getVoteCostEstimate } from '../DiscoverContainer/actions'

class PostDetailContainer extends Component {
  componentWillMount () {
    const { post } = this.props
    this.props.clearPostDetail()
    this.props.getReplies(post.postHash)
    if (post.postType === 'MILESTONE') {
      this.props.fetchUserMilstoneData(post.postHash)
    }
  }

  render () {
    return (
      <PostDetail
        navigation={this.props.navigation}
        post={this.props.post}
        replies={this.props.replies}
        loading={this.props.loading}
        errorMessage={this.props.errorMessage}
        milestoneData={this.props.milestoneData}
        processPutOption={this.props.processPutOption}
        getReplies={this.props.getReplies}
        milestoneDataLoading={this.props.milestoneDataLoading}
        fetchUserMilstoneData={this.props.fetchUserMilstoneData}
        voteFeedPost={this.props.voteFeedPost}
        getVoteCostEstimate={this.props.getVoteCostEstimate}
        fetchingVoteCost={this.props.fetchingVoteCost}
        voteInfo={this.props.voteInfo}
        voteInfoError={this.props.voteInfoError}
      />
    )
  }
}

const mapStateToProps = state => ({
  replies: state.postDetailReducer.replies,
  loading: state.postDetailReducer.loading,
  errorMessage: state.postDetailReducer.errorMessage,
  milestoneData: state.postDetailReducer.milestoneData,
  milestoneDataLoading: state.postDetailReducer.milestoneDataLoading,
  fetchingVoteCost: state.discoverReducer.fetchingVoteCost,
  voteInfo: state.discoverReducer.voteInfo,
  voteInfoError: state.discoverReducer.voteInfoError,
  post: state.discoverReducer.posts.find((post) => {
    return post.postHash === state.postDetailReducer.currentParentPostHash
  })
})

const mapDispatchToProps = (dispatch) => ({
  getReplies: (postHash) => dispatch(getReplies(postHash)),
  fetchUserMilstoneData: (postHash) => dispatch(fetchUserMilstoneData(postHash)),
  processPutOption: (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, refreshCallback) =>
    dispatch(processPutOption(postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, refreshCallback)),
  clearPostDetail: () => dispatch(clearPostDetail()),
  voteFeedPost: (postHash, value) => dispatch(voteFeedPost(postHash, value)),
  getVoteCostEstimate: (postHash) => dispatch(getVoteCostEstimate(postHash))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailContainer)
