import React, { Component } from 'react'
import { Modal, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import ventureum from '../../../theme/variables/ventureum'
import { DOWN_VOTE, UP_VOTE } from '../../../utils/constants'

export default class VoteBubble extends Component {
  render () {
    const { x, y, voteBubbleVisible, upVotable, downVotable } = this.props
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={voteBubbleVisible}
        onRequestClose={
          () => { }
        }
      >
        <View style={{ flex: 1, backgroundColor: 'transparent' }} >
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => this.props.toggleVoteBubble()}
          >
            <View style={{ flex: 1, backgroundColor: 'transparent' }} />
          </TouchableWithoutFeedback>
          <View style={{
            backgroundColor: 'white',
            position: 'absolute',
            top: y - 20,
            left: x - 36,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: null,
            borderRadius: 35,
            borderColor: 'white',
            flexWrap: 'wrap',
            shadowColor: ventureum.secondaryColor,
            shadowOffset: { width: 0, height: 0.7 },
            shadowOpacity: 0.3,
            shadowRadius: 1.3,
            elevation: 3
          }}>
            <TouchableOpacity
              transparent
              style={{margin: ventureum.basicPadding}}
              onPress={() => {
                this.props.onVoteAction(UP_VOTE)
              }}
              disabled={!upVotable}
            >
              <Icon
                style={{
                  fontSize: 34,
                  color: ventureum.secondaryColor
                }}
                type='Feather'
                name='thumbs-up' />
            </TouchableOpacity>
            <TouchableOpacity
              transparent
              style={{margin: ventureum.basicPadding}}
              onPress={() => {
                this.props.onVoteAction(DOWN_VOTE)
              }}
              disabled={!downVotable}
            >
              <Icon
                name='thumbs-down'
                type='Feather'
                style={{
                  fontSize: 34,
                  color: ventureum.secondaryColor
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal >
    )
  }
}
