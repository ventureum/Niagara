import React, { Component } from 'react'
import { KeyboardAvoidingView, View, TextInput, Switch } from 'react-native'
import { Icon, Text, Button, Thumbnail, Spinner } from 'native-base'
import styles from './styles'
import { markdown } from 'markdown'

export default class NewPostModal extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      title: null,
      text: null,
      toMainnet: false
    })
  }

  findFirstImageURL = (tree) => {
    if (Array.isArray(tree)) {
      for (let i = 0; i < tree.length; i++) {
        // base case:
        if (tree[i] === 'img' && tree.length === 2 && i === 0) {
          return tree[1].href
        }
        let found = this.findFirstImageURL(tree[i])
        if (found !== false) {
          return found
        }
      }
    }
    if (typeof tree === 'object') {
      for (let key in tree) {
        let found = this.findFirstImageURL(tree[key])
        if (found !== false) {
          return found
        }
      }
    }
    return false
  }

  getSubtitle = (tree) => {
    let characterLimit = 150
    let subtitle = ''
    for (let i = 0; i < tree.length && characterLimit > 0; i++) {
      if (tree[i][0] === 'para') {
        for (let j = 1; j < tree[i].length && characterLimit > 0; j++) {
          if (typeof tree[i][j] === 'string') {
            let words = tree[i][j].split(' ')
            for (let x = 0; x < words.length; x++) {
              if (words[x].length <= characterLimit) {
                subtitle += words[x] + ' '
                characterLimit -= words[x].length
              } else {
                subtitle += '...'
                return subtitle
              }
            }
          }
        }
      }
    }
    return subtitle
  }

  render () {
    return (
      <KeyboardAvoidingView behavior='padding' enabled style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Icon
            active
            name='arrow-back'
            onPress={() => {
              this.props.goBack(null, null)
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
                  if (this.state.title !== null && this.state.text !== null) {
                    let tree = markdown.parse(this.state.text)
                    const image = this.findFirstImageURL(tree)
                    const subtitle = this.getSubtitle(tree)
                    if (image === false) {
                      this.props.goBack(this.state.title, this.state.text, undefined, subtitle)
                    } else {
                      this.props.goBack(this.state.title, this.state.text, image, subtitle)
                    }
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
