import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import { Icon } from 'native-base'
import { DOWN_VOTE, UP_VOTE } from '../../../utils/constants'
import { Avatar, Day, utils, Bubble } from 'react-native-gifted-chat'
import ventureum from '../../../theme/variables/ventureum'

let numeral = require('numeral')
const FORMAT = '0[.]0a'

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
  }),
  voteButton: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginHorizontal: 5,
    marginVertical: 2
  }
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
    const { position } = this.props
    const { currentMessage } = this.props
    if (currentMessage.postVoteCountInfo.totalVoteCount !== 0) {
      const { postVoteCountInfo, requestorVoteCountInfo } = currentMessage
      return (
        <View style={{
          alignSelf: position === 'left' ? 'flex-start' : 'flex-end',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <TouchableOpacity
            style={{
              ...styles.voteButton,
              backgroundColor: requestorVoteCountInfo.upvoteCount !== 0 ? ventureum.lightSecondaryColor : undefined
            }}
            onPress={() => {
              this.props.inMessageVoteAction(currentMessage.postHash, UP_VOTE)
            }}
          >
            <Icon
              name='thumbs-o-up'
              type='FontAwesome'
              style={{ fontSize: 14 }}
            >
              {numeral(postVoteCountInfo.upvoteCount).format(FORMAT)}
            </Icon>
          </TouchableOpacity>
          <Text>
            ${numeral(currentMessage.rewards).format(FORMAT)}
          </Text>
          <TouchableOpacity
            style={{
              ...styles.voteButton,
              backgroundColor: requestorVoteCountInfo.downvoteCount !== 0 ? ventureum.lightErrorColor : undefined
            }}
            onPress={() => {
              this.props.inMessageVoteAction(currentMessage.postHash, DOWN_VOTE)
            }}
          >
            <Icon
              name='thumbs-o-down'
              type='FontAwesome'
              style={{ fontSize: 14 }}
            >
              {numeral(postVoteCountInfo.downvoteCount).format(FORMAT)}
            </Icon>
          </TouchableOpacity>
        </View>
      )
    }
    return null
  }

  render () {
    const {
      currentMessage,
      nextMessage,
      position
    } = this.props
    const sameUser = isSameUser(currentMessage, nextMessage)
    return (
      <View>
        {this.renderDay()}
        <View
          style={[
            styles[position].container,
            { marginBottom: sameUser ? 7 : 13 }
          ]
          }
        >
          {position === 'left' ? this.renderAvatar() : null}
          <View style={{
            flexDirection: 'column'
          }}
          >
            {this.renderBubble()}
            {this.renderReward()}
          </View>
          {position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    )
  }
}
