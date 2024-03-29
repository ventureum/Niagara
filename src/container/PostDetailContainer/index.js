import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostDetailV2 from '../../stories/screens/PostDetailV2'
import {
  getReplies,
  fetchUserMilstoneData,
  processPutOption,
  clearPostDetail,
  voteFeedPost,
  refreshViewingPost,
  getVoteCostEstimate,
  newPost,
  voteFeedReply,
  getMoreReplies
} from '../../actions'

class PostDetailContainer extends Component {
  componentWillMount () {
    const post = this.props.post
    this.props.clearPostDetail()
    this.props.getReplies(post.postHash)
    if (post.postType === 'MILESTONE') {
      this.props.fetchUserMilstoneData(post.postHash)
    }
  }

  getMoreReplies= () => {
    const post = this.props.post
    this.props.getMoreReplies(post.postHash)
  }

  render () {
    const post = this.props.post
    return (
      <PostDetailV2
        navigation={this.props.navigation}
        post={post}
        getMoreReplies={this.getMoreReplies}
        replies={this.props.replies}
        errorMessage={this.props.errorMessage}
        milestoneData={this.props.milestoneData}
        processPutOption={this.props.processPutOption}
        getReplies={this.props.getReplies}
        milestoneDataLoading={this.props.milestoneDataLoading}
        fetchUserMilstoneData={this.props.fetchUserMilstoneData}
        voteFeedPost={this.props.voteFeedPost}
        voteFeedReply={this.props.voteFeedReply}
        newPost={this.props.newPost}
        boardId={this.props.boardId}
        refreshViewingPost={this.props.refreshViewingPost}
      />
    )
  }
}

const mapStateToProps = ({ forumReducer }) => ({
  replies: forumReducer.replies,
  loading: forumReducer.loading,
  errorMessage: forumReducer.errorMessage,
  milestoneData: forumReducer.milestoneData,
  milestoneDataLoading: forumReducer.milestoneDataLoading,
  boardId: forumReducer.boardId,
  post: forumReducer[forumReducer.currentParentPost.targetArray].posts.find((post) => {
    return post.postHash === forumReducer.currentParentPost.postHash
  })
})

const mapDispatchToProps = (dispatch) => ({
  getReplies: (postHash) => dispatch(getReplies(postHash)),
  fetchUserMilstoneData: (postHash) => dispatch(fetchUserMilstoneData(postHash)),
  processPutOption: (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, refreshCallback) =>
    dispatch(processPutOption(postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, refreshCallback)),
  clearPostDetail: () => dispatch(clearPostDetail()),
  voteFeedPost: (postHash, value) => dispatch(voteFeedPost(postHash, value)),
  voteFeedReply: (postHash, value) => dispatch(voteFeedReply(postHash, value)),
  getVoteCostEstimate: (postHash) => dispatch(getVoteCostEstimate(postHash)),
  newPost: (content, boardId, parentHash, postType, destination, refreshCallback) =>
    dispatch(newPost(content, boardId, parentHash, postType, destination, refreshCallback)),
  refreshViewingPost: (postHash) => dispatch(refreshViewingPost(postHash)),
  getMoreReplies: (postHash) => dispatch(getMoreReplies(postHash))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostDetailContainer)
