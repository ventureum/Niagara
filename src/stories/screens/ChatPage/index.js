import React, { Component } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { processContent } from '../../../utils/content'
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
              name: chatContent[i].actor,
              avatar: 'https://placeimg.com/140/140/any'
            }
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

  render () {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => {
          this.onSend(messages)
        }}
        user={{
          _id: this.props.userAddress
        }}
      />
    )
  }
}
