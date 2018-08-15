import React, { Component } from 'react'
import ChatPage from '../../stories/screens/ChatPage'
import { newPost } from '../DiscoverContainer/actions'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import axios from 'axios'
import { client } from '../../services/forum'
import {
  getInitialChatHistory,
  fetchLatestChat,
  clearChat,
  fetchEalierChat
} from './actions'

class ChatPageContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      subscription: null
    }
    const post = this.props.navigation.getParam('post', {})
    this.props.getInitialChatHistory(post.postHash)
    this.subscribeToFeed(
      `comment:${post.postHash}`,
      this.onReceiveUpdate
    )
  }
  onReceiveUpdate = (updata) => {
    const post = this.props.navigation.getParam('post', {})
    this.props.fetchLatestChat(post.postHash)
  }

  subscribeToFeed = async (feed, callback) => {
    const feedSlug = feed.split(':')
    const response = await axios.post(
      Config.FEED_TOKEN_API,
      {
        'feedSlug': feedSlug[0],
        'userId': feedSlug[1],
        'getStreamApiKey': Config.STREAM_API_KEY,
        'getStreamApiSecret': Config.STREAM_API_SECRET
      }
    )
    if (!response.data.ok) {
      throw new Error(response.data.message)
    }

    const targetFeed = client.feed(feedSlug[0], feedSlug[1], response.data.feedToken)
    const subscription = targetFeed.subscribe(callback)
    this.setState({
      subscription: subscription
    })
  }

  componentWillUnmount () {
    this.state.subscription.cancel()
    this.props.clearChat()
  }

  render () {
    const post = this.props.navigation.getParam('post', {})
    return (
      <ChatPage
        chatContent={this.props.chatContent}
        post={post}
        newPost={this.props.newPost}
        userAddress={this.props.userAddress}
        boardHash={this.props.boardHash}
        chatContentLoading={this.props.chatContentLoading}
        fetchEalierChat={this.props.fetchEalierChat}
        reachEarliestChat={this.props.reachEarliestChat}
      />
    )
  }
}
const mapDispatchToProps = (dispatch) => ({
  newPost: (content, boardId, parentHash, postType, destination) =>
    dispatch(newPost(content, boardId, parentHash, postType, destination)),
  getInitialChatHistory: (postHash) => dispatch(getInitialChatHistory(postHash)),
  fetchLatestChat: (postHash) => dispatch(fetchLatestChat(postHash)),
  fetchEalierChat: (postHash) => dispatch(fetchEalierChat(postHash)),
  clearChat: () => dispatch(clearChat())
})

const mapStateToProps = state => ({
  chatContent: state.chatPageReducer.chatContent,
  chatContentLoading: state.chatPageReducer.chatContentLoading,
  reachEarliestChat: state.chatPageReducer.reachEarliestChat,
  userAddress: state.walletReducer.walletAddress,
  boardHash: state.discoverReducer.boardHash
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatPageContainer)
