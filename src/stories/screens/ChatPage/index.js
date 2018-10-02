import React, { Component } from 'react'
import { GiftedChat, LoadEarlier } from 'react-native-gifted-chat'
import { processContent } from '../../../utils/content'
import WalletUtils from '../../../utils/wallet'
import { DOWN_VOTE, UP_VOTE } from '../../../utils/constants'
import Message from '../../components/Message'
import { Header, Container, Left, Body, Right, Button, Icon, Title } from 'native-base'
import ConfirmationModel from '../../components/ConfirmationModal'
let moment = require('moment')

export default class ChatPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      confirmModalVisible: false,
      action: 0,
      targetMessageHash: ''
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
            rewards: chatContent[i].rewards,
            postVoteCountInfo: chatContent[i].postVoteCountInfo,
            requestorVoteCountInfo: chatContent[i].requestorVoteCountInfo,
            fetchingVoteCost: nextProps.fetchingVoteCost,
            voteInfo: nextProps.voteInfo,
            voteInfoError: nextProps.voteInfoError
          }
        )
      }
      this.setState({ messages: messages }, () => {
      })
    }
  }

  toggleConfirmationModal = () => {
    this.setState({
      confirmModalVisible: !this.state.confirmModalVisible
    })
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
            this.props.getVoteCostEstimate(message.postHash)
            this.setState({
              confirmModalVisible: !this.state.confirmModalVisible,
              action: UP_VOTE,
              targetMessageHash: message.postHash
            })
            break
          case 1:
            this.props.getVoteCostEstimate(message.postHash)
            this.setState({
              confirmModalVisible: !this.state.confirmModalVisible,
              action: DOWN_VOTE,
              targetMessageHash: message.postHash
            })
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
      />
    )
  }

  inMessageVoteAction= (postHash, action) => {
    this.props.getVoteCostEstimate(postHash)
    this.setState({
      confirmModalVisible: !this.state.confirmModalVisible,
      action: action,
      targetMessageHash: postHash
    })
  }

  render () {
    const {
      fetchingVoteCost,
      voteInfo,
      voteInfoError
    } = this.props
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Active Chat</Title>
          </Body>
          <Right />
        </Header>
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
          getVoteCostEstimate={this.props.getVoteCostEstimate}
          updatePostRewards={this.updatePostRewards}
          inMessageVoteAction={this.inMessageVoteAction}
        />
        <ConfirmationModel
          modalVisible={this.state.confirmModalVisible}
          toggleModal={this.toggleConfirmationModal}
          onAction={() => {
            this.updatePostRewards(this.state.targetMessageHash, this.state.action)
          }}
          fetchingVoteCost={fetchingVoteCost}
          voteInfo={voteInfo}
          voteInfoError={voteInfoError}
          getVoteCostEstimate={
            (postHash) => {
              this.props.getVoteCostEstimate(postHash)
            }
          }
        />
      </Container>

    )
  }
}
