import React, { Component } from 'react'
import { Text, Icon } from 'native-base'
import { TextInput, View, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import styles from './styles'
import { getPostTypeHash } from '../../../services/forum'
import {findFirstImageURL, getSubtitle} from '../../../utils/content'

export default class Reply extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      text: null
    })
  }

  onSendComment = (parentPost, text) => {
    if (this.state.text !== null) {
      let image = findFirstImageURL(text)
      if (image === false) {
        image = ''
      }
      const subtitle = getSubtitle(text)
      const content = {
        title: '',
        text: text,
        image: image,
        subtitle: subtitle
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
      </KeyboardAvoidingView>
    )
  }
}
