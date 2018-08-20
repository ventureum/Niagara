import React, { Component } from 'react'
import { Text, Modal, View, TouchableOpacity } from 'react-native'
import styles from './styles'

export default class ConfirmationModal extends Component {
  render () {
    return (
      <Modal
        animationType={'slide'}
        transparent
        visible={this.props.modalVisible}
        onRequestClose={
          () => {}
        }
      >
        <View style={styles.modalViewContainer}>
          <View style={styles.messageContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.title} >Voting</Text>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.messageText}>Are you sure you want to use your reputation to up/down vote this post?</Text>
            </View>
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                }}
              >
                <Text style={styles.buttonText}>REFRESH</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.props.toggleModal()
                }}
              >
                <Text style={styles.buttonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.props.onAction()
                  this.props.toggleModal()
                }}
              >
                <Text style={styles.buttonText}>CONFIRM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >
    )
  }
}
