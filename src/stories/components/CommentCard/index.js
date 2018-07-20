import * as React from 'react'

import {
  View,
  Text
} from 'react-native'

import { Thumbnail } from 'native-base'
import styles from './styles'
import Markdown from 'react-native-markdown-renderer'
let moment = require('moment')

export default class CommentCard extends React.Component {
  render () {
    let { post } = this.props
    return (
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Thumbnail small source={{ uri: post.avatar }} />
        </View>
        <View style={styles.ContentContainer}>
          <View style={styles.authorContainer}>
            <Text
              style={{
                color: '#aaa',
                fontSize: 16
              }}
            >
              {'@' + post.author + ' replied:'}
            </Text>
            <Text style={{ fontSize: 12, color: '#aaa' }}>
              {moment.utc(post.time).fromNow()}
            </Text>
          </View>
          <View style={styles.commentContainer} >
            <Markdown> {post.content.text} </Markdown>
          </View>
        </View>
      </View >
    )
  }
}
