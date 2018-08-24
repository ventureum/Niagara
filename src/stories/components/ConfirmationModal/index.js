import React, { Component } from 'react'
import { Text, Modal, View, TouchableOpacity } from 'react-native'
import { Spinner } from 'native-base'
import styles from './styles'

export default class ConfirmationModal extends Component {
  renderNormal = () => {
    return (
      <View style={styles.messageContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title} >Voting</Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.messageText}>
            {this.props.voteInfoError === null
              ? `This voting action will cost you ${this.props.voteInfo.fuelCost} reputations.`
              : 'Vote info fetching error'
            }
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.getVoteCostEstimate()
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
          {this.props.voteInfoError === null
            ? <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.props.onAction()
                this.props.toggleModal()
              }}
            >
              <Text style={styles.buttonText}>CONFIRM</Text>
            </TouchableOpacity>
            : null
          }
        </View>
      </View >
    )
  }

  renderFetching = () => {
    return (
      <View style={styles.messageContainer}>
        <Spinner />
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.toggleModal()
            }}
          >
            <Text style={styles.buttonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    return (
      <Modal
        animationType={'slide'}
        transparent
        visible={this.props.modalVisible}
        onRequestClose={
          () => { }
        }
      >
        <View style={styles.modalViewContainer}>
          {this.props.fetchingVoteCost || this.props.voteInfo === null
            ? this.renderFetching()
            : this.renderNormal()
          }
        </View>
      </Modal >
    )
  }
}
