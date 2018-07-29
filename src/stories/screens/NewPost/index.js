import React, { Component } from 'react'
import { KeyboardAvoidingView, View, TextInput, Switch, ScrollView } from 'react-native'
import { Icon, Text, Button, Thumbnail, Spinner, Toast } from 'native-base'
import styles from './styles'
import WalletUtils from '../../../utils/wallet'
import { getPostTypeHash } from '../../../services/forum'
import { processContent } from '../../../utils/content'

export default class NewPost extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      title: null,
      text: null,
      toMainnet: false
    })
  }

  onTweet = (title, text) => {
    if (this.state.title !== null && this.state.text !== null) {
      const content = processContent(title, text)
      if (content === false) {
        Toast.show({
          text: 'Invalid text detected',
          position: 'center',
          buttonText: 'Okay',
          type: 'danger',
          duration: 10000
        })
        return
      }
      let destination
      if (this.state.toMainnet) {
        destination = 'ON-CHAIN'
      } else {
        destination = 'OFF-CHAIN'
      }
      const boardId = this.props.boardHash
      const web3 = WalletUtils.getWeb3Instance()
      const noParent = web3.utils.padRight('0x0', 64)
      const postType = getPostTypeHash('POST')
      this.props.newPost(content, boardId, noParent, postType, destination)
      this.props.navigation.goBack()
    }
  }

  render () {
    return (
      <KeyboardAvoidingView enabled style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Icon
            active
            name='arrow-back'
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{this.state.toMainnet ? 'On-chain' : 'Off-chain'}</Text>
            <Switch
              value={this.state.toMainnet}
              onValueChange={(value) => {
                this.setState({ toMainnet: value })
              }}
              style={{ marginRight: 3 }}
            />
            {this.props.loading
              ? <Spinner color='green' style={{ paddingBottom: 8 }} />
              : <Button
                style={{ height: '70%' }}
                info
                rounded
                onPress={() => {
                  this.onTweet(this.state.title, this.state.text)
                }}
              >
                <Text>Tweet</Text>
              </Button>
            }
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.avatarContainer}>
            <Thumbnail small source={{ uri: this.props.avatar }} />
          </View>
          <View style={styles.textInputContainer} >
            <ScrollView>
              <TextInput
                placeholder='Title'
                onChangeText={(title) => {
                  this.setState({ title })
                }}
                value={this.state.title}
              />
              <TextInput
                placeholder='Share your ideas!'
                multiline
                underlineColorAndroid='transparent'
                onChangeText={(text) => {
                  this.setState({ text })
                }}
                value={this.state.text}
              />
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView >
    )
  }
}
