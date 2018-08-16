import React, { Component } from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './styles'

export default class MessageVoteButton extends Component {
  render () {
    let icon
    if (this.props.type === 'up') {
      icon = (
        <Icon
          name='thumbs-o-up'
          size={14}
        > 10
        </Icon>
      )
    } else {
      icon = (<Icon
        name='thumbs-o-down'
        size={14}
      > 5
      </Icon>
      )
    }

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.onPress}
      >
        {icon}
      </TouchableOpacity>
    )
  }
}
