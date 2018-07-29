import React, { Component } from 'react'
import { Text, Icon, Toast } from 'native-base'
import { TextInput, View, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native'
import styles from './styles'
import { getPostTypeHash } from '../../../services/forum'
import { processContent } from '../../../utils/content'
export default class Reply extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      text: null
    })
  }

  onSendComment = (parentPost, text) => {
    if (this.state.text !== null) {
      const content = processContent('', text)
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
      if (parentPost.source !== 'database') {
        destination = 'ONCHAIN'
      } else {
        destination = 'OFFCHAIN'
      }
      const boardId = this.props.boardHash
      const parentHash = parentPost.postHash
      const postType = getPostTypeHash('COMMENT')
      this.props.newPost(content, boardId, parentHash, postType, destination)
      this.props.navigation.goBack()
    }
  }

  render () {
    const { post } = this.props

    return (
      <KeyboardAvoidingView style={styles.replyContainer}>
        <View style={styles.replyHeader} >
          <View style={styles.headerLeft} >
            <Icon
              active
              name='arrow-back'
              onPress={() => {
                this.props.navigation.goBack()
              }}
            />
            <Text style={{ paddingLeft: 20, paddingTop: 3 }}> Reply to Post</Text>
          </View>
          <TouchableOpacity
            style={styles.headerRight}
            onPress={() => {
              this.onSendComment(post, this.state.text)
            }}>
            <Text>POST</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.postTitle}>
            <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 16 }}>{post.content.title}</Text>
          </View>
          <View>
            <TextInput
              autoFocus
              placeholder='Share your ideas!'
              multiline
              underlineColorAndroid='transparent'
              onChangeText={(text) => {
                this.setState({ text })
              }}
              value={this.state.text}
              selectionColor='red'
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}
