import React, { Component } from 'react'
import { KeyboardAvoidingView, View, TextInput, Switch } from 'react-native'
import { Icon, Text, Button, Thumbnail, Spinner } from 'native-base'
import styles from './styles'

export default class NewPostModal extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      title: null,
      text: null,
      toMainnet: false
    })
  }

  render () {
    return (
      <KeyboardAvoidingView behavior='padding' enabled style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Icon
            active
            name='arrow-back'
            onPress={() => {
              this.props.goBack()
            }}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{this.state.toMainnet ? 'On-chain' : 'Off-chain'}</Text>
            <Switch
              value={this.state.toMainnet}
              onValueChange={(value) => {
                this.setState({ toMainnet: value })
              }}
              style={{marginRight: 3}}
            />
            {this.props.loading
              ? <Spinner color='green' style={{ paddingBottom: 8 }} />
              : <Button
                style={{ height: '70%' }}
                info
                rounded
                onPress={() => {
                  if (this.state.title !== null && this.state.text !== null) {
                    this.props.goBack(this.state.title, this.state.text)
                  }
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
          <View style={styles.textInputContainer}>
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
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}
