import React, { Component } from 'react'
import { View } from 'react-native'
import { Text, Thumbnail } from 'native-base'
import styles from './styles'
import WebView from 'react-native-android-fullscreen-webview-video'

let moment = require('moment')

export default class VideoDetails extends Component {
  render () {
    const { post, url } = this.props
    const key = 'watch?v='
    const offset = url.indexOf(key) + key.length
    const videoID = url.substring(offset)
    const { title } = post.content
    return (
      <View style={styles.container}>
        <WebView
          source={{ uri: `https://www.youtube.com/embed/${videoID}?autoplay=0?controls=0?modestbranding=1'` }}
          style={{ alignSelf: 'stretch', height: 300 }}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.metaInfoContainer}>
            <Thumbnail small rounded source={post.photoUrl === ''
              ? { uri: 'https://placeimg.com/120/120/any' }
              : post.photoUrl}
            />
            <View style={styles.metaInfo}>
              <Text style={styles.usernameText}>{post.username}</Text>
              <Text style={styles.timeText}>published on {moment(post.time).format('MMMM Do YYYY')}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
