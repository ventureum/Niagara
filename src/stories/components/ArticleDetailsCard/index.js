import React, { Component } from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import {
  Text,
  Thumbnail
} from 'native-base'
import Markdown from 'react-native-markdown-renderer'
import styles from './styles'
let moment = require('moment')

const markdownStyles = StyleSheet.create({
  text: styles.text
})

export default class ArticleDetails extends Component {
  render () {
    const { post } = this.props
    const { title, text } = post.content
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Thumbnail small rounded source={post.photoUrl === ''
            ? { uri: 'https://placeimg.com/120/120/any' }
            : post.photoUrl}
          />
          <View style={styles.metaInfo}>
            <Text style={styles.usernameText}>{post.username}</Text>
            <Text style={styles.timeText}>published on {moment(post.time).format('MMMM Do YYYY')}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          <Markdown style={markdownStyles}>{text}</Markdown>
        </View>
      </View>
    )
  }
}
