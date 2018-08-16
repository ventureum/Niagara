import React, { Component } from 'react'
import { GiftedChat, LoadEarlier } from 'react-native-gifted-chat'
import { processContent } from '../../../utils/content'
import WalletUtils from '../../../utils/wallet'
import { DOWN_VOTE, UP_VOTE } from '../../../utils/constants'
import Message from '../../components/Message'
let moment = require('moment')

export default class ChatPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  componentWillReceiveProps (nextProps) {
    const { chatContent } = nextProps
    if (chatContent.length !== 0) {
      let messages = []
      for (let i = 0; i < chatContent.length; i++) {
        messages.push(
          {
            _id: chatContent[i].id,
            text: chatContent[i].content.text,
            createdAt: moment.utc(chatContent[i].time).local(),
            user: {
              _id: chatContent[i].actor,
              name: WalletUtils.getAddrAbbre(chatContent[i].actor),
              avatar: 'https://placeimg.com/140/140/any'
            },
            postHash: chatContent[i].postHash,
            rewards: chatContent[i].rewards
          }
        )
      }
      this.setState({ messages: messages }, () => {
      })
    }
  }

  onSend = (messages = []) => {
    if (messages.length >= 1) {
      const content = processContent('', messages[0].text)
      let destination
      const { post } = this.props
      if (this.state.onChain) {
        destination = 'ON-CHAIN'
      } else {
        destination = 'OFF-CHAIN'
      }
      const boardId = this.props.boardHash
      const parentHash = post.postHash
      const postType = 'COMMENT'
      this.props.newPost(content, boardId, parentHash, postType, destination)
    }
  }

  onLoadEarlier = () => {
    this.props.fetchEalierChat(this.props.post.postHash)
  }

  renderLoadEarlier = (props) => {
    let label = 'Load earlier message.'
    if (this.props.reachEarliestChat) {
      label = 'Reached earliest message.'
    }
    return (
      <LoadEarlier {...props}
        label={label} />
    )
  }

  onLongPress = (context, message) => {
    if (message.text) {
      const options = [
        'Upvote',
        'Downvote',
        'Cancel'
      ]
      const cancelButtonIndex = options.length - 1
      context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            this.updatePostRewards(message.postHash, UP_VOTE)
            break
          case 1:
            this.updatePostRewards(message.postHash, DOWN_VOTE)
            break
        }
      })
    }
  }

  updatePostRewards = (postHash, action) => {
    const { boardHash } = this.props
    this.props.updatePostRewards(boardHash, postHash, action)
  }

  renderMessage = (props) => {
    return (
      <Message
        {...props}
        updatePostRewards={this.updatePostRewards}
      />
    )
  }

  render () {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => {
          this.onSend(messages)
        }}
        user={{
          _id: this.props.userAddress,
          name: this.props.userAddress
        }}
        isAnimated
        loadEarlier
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.props.chatContentLoading}
        renderLoadEarlier={this.renderLoadEarlier}
        onLongPress={this.onLongPress}
        renderCustomView={this.renderCustomView}
        renderMessage={this.renderMessage}
      />
    )
  }
}
