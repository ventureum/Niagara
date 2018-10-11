import React, { Component } from 'react'
import { Modal, View, TouchableWithoutFeedback, TextInput, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import ventureum from '../../../theme/variables/ventureum'

export default class ReplyModal extends Component {
  state = {
    text: ''
  }

  render () {
    const { modalVisible } = this.props
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={modalVisible}
        onRequestClose={
          () => this.props.toggleReplyModal()
        }
      >
        <View style={{ flex: 1, backgroundColor: 'transparent' }} >
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => this.props.toggleReplyModal()}
          >
            <View style={{ flex: 1, backgroundColor: '#333333', opacity: 0.4 }} />
          </TouchableWithoutFeedback>
          <View style={{
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            height: 163,
            width: '100%',
            borderWidth: null,
            flexWrap: 'wrap',
            flexDirection: 'row'
          }}>
            <View style={{ flex: 1 }}>
              <TextInput
                underlineColorAndroid='transparent'
                placeholder={this.props.inputPlaceholder}
                multiline
                maxLength={4096}
                enablesReturnKeyAutomatically
                autoCorrect
                autoFocus
                style={{ marginHorizontal: ventureum.basicPadding }}
                onChangeText={(value) => {
                  this.setState({ text: value })
                }}
                value={this.state.text}
              />
            </View>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                margin: ventureum.basicPadding * 2
              }}
              onPress={() => {
                this.props.onSubmitComment(this.state.text)
                this.setState({text: null})
              }}
              disabled={this.state.text === ''}
            >
              <Icon
                name='md-send'
                type='Ionicons'
                style={{
                  color: this.state.text === ''
                    ? ventureum.defaultIconColor
                    : ventureum.lightSecondaryColor
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal >
    )
  }
}
