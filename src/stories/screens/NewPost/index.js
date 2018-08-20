import React, { Component } from 'react'
import { KeyboardAvoidingView, View, TextInput, Switch, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native'
import { Container, Icon, Title, Text, Header, Left, Body, Right, Button, Thumbnail, Spinner, Toast } from 'native-base'
import styles from './styles'
import WalletUtils from '../../../utils/wallet'
import { processContent } from '../../../utils/content'
import { NEW_POST_REPUTATION_COST } from '../../../utils/constants'

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
      const postType = 'POST'
      let message = `A new ${destination} reply costs ${NEW_POST_REPUTATION_COST} reputation`
      if (destination === 'ON-CHAIN') {
        message += `\n\nAdditional transaction fee applies to ON-CHAIN post`
      }
      Alert.alert(
        'Please confirm',
        message,
        [
          {
            text: 'Cancel',
            onPress: () => {
            },
            style: 'cancel'
          },
          {
            text: 'Confirm',
            onPress: () => {
              this.props.newPost(content, boardId, noParent, postType, destination)
              this.props.navigation.goBack()
            }
          }
        ],
        { cancelable: false }
      )
    }
  }

  render () {
    return (
      <Container>
        <Header >
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Title>{this.state.toMainnet ? 'On-chain ' : 'Off-chain '}</Title>
            <Switch
              value={this.state.toMainnet}
              onValueChange={(value) => {
                this.setState({ toMainnet: value })
              }}
              style={{ marginRight: 3 }}
            />
          </Body>
          <Right>
            {this.props.loading
              ? <Spinner color='green' style={{ paddingBottom: 8 }} />
              : <TouchableOpacity
                style={styles.tweetButton}
                onPress={() => {
                  this.onTweet(this.state.title, this.state.text)
                }}
              >
                <Text style={styles.headerButtonText}>Tweet</Text>
              </TouchableOpacity>
            }
          </Right>
        </Header>
        <KeyboardAvoidingView enabled style={styles.modalContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.avatarContainer}>
              <Thumbnail small source={{ uri: this.props.avatar }} />
            </View>
            <View style={styles.textInputContainer} >
              <ScrollView>
                <View style={styles.divider} >
                  <TextInput
                    placeholder='Title'
                    onChangeText={(title) => {
                      this.setState({ title })
                    }}
                    value={this.state.title}
                    underlineColorAndroid='transparent'
                    style={{ paddingBottom: Platform.OS === 'ios' ? 4 : 0 }}
                  />
                </View>
                <TextInput
                  placeholder='Share your ideas!'
                  multiline
                  underlineColorAndroid='transparent'
                  onChangeText={(text) => {
                    this.setState({ text })
                  }}
                  value={this.state.text}
                  style={{ paddingTop: Platform.OS === 'ios' ? 4 : 0 }}
                />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
