import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostDetailV2 from '../../stories/screens/PostDetailV2'
import {
  getReplies,
  fetchUserMilstoneData,
  processPutOption,
  clearPostDetail,
  voteFeedPost,
  refreshViewingPost
} from './actions'
import { getVoteCostEstimate, newPost } from '../DiscoverContainer/actions'

class PostDetailContainer extends Component {
  componentWillMount () {
    const post = this.props.post
    this.props.clearPostDetail()
    this.props.getReplies(post.postHash)
    if (post.postType === 'MILESTONE') {
      this.props.fetchUserMilstoneData(post.postHash)
    }
  }

  render () {
    const post = this.props.post
    return (
      <PostDetailV2
        navigation={this.props.navigation}
        post={post}
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
        newPost={this.props.newPost}
        boardHash={this.props.boardHash}
        refreshViewingPost={this.props.refreshViewingPost}
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
  boardHash: state.discoverReducer.boardHash,
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
  getVoteCostEstimate: (postHash) => dispatch(getVoteCostEstimate(postHash)),
  newPost: (content, boardId, parentHash, postType, destination) => dispatch(newPost(content, boardId, parentHash, postType, destination)),
  refreshViewingPost: (postHash) => dispatch(refreshViewingPost(postHash))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailContainer)
