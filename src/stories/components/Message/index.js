import React from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import { DOWN_VOTE, UP_VOTE } from '../../../utils/constants'
import { Avatar, Day, utils, Bubble } from 'react-native-gifted-chat'
import MessageVoteButton from '../../components/MessageVoteButton'

const { isSameUser, isSameDay } = utils

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0
    }
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8
    }
  })
}
export default class Message extends React.Component {
  getInnerComponentProps () {
    const { containerStyle, ...props } = this.props
    return {
      ...props,
      isSameUser,
      isSameDay
    }
  }

  renderDay () {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps()
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps)
      }
      return <Day {...dayProps} />
    }
    return null
  }

  renderBubble () {
    const bubbleProps = this.getInnerComponentProps()
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps)
    }
    return <Bubble {...bubbleProps} />
  }

  renderAvatar () {
    const avatarProps = this.getInnerComponentProps()
    if (this.props.renderAvatar) {
      return this.props.renderAvatar(avatarProps)
    }
    return <Avatar {...this.props} />
  }

  renderReward () {
    const { currentMessage, position } = this.props
    if (currentMessage.rewards !== 0) {
      return (
        <View style={{
          alignSelf: position === 'left' ? 'flex-start' : 'flex-end',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <MessageVoteButton
            onPress={() => {
              this.props.updatePostRewards(currentMessage.postHash, UP_VOTE)
            }}
            type='up' />
          <Text>
            ${currentMessage.rewards}
          </Text>
          <MessageVoteButton
            onPress={() => {
              this.props.updatePostRewards(currentMessage.postHash, DOWN_VOTE)
            }}
            type='down' />
        </View>
      )
    }
    return null
  }

  render () {
    const sameUser = isSameUser(this.props.currentMessage, this.props.nextMessage)
    return (
      <View>
        {this.renderDay()}
        <View
          style={[
            styles[this.props.position].container,
            { marginBottom: sameUser ? 2 : 10 }
          ]
          }
        >
          {this.props.position === 'left' ? this.renderAvatar() : null}
          <View style={{
            flexDirection: 'column'
          }}
          >
            {this.renderBubble()}
            {this.renderReward()}
          </View>
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    )
  }
}
