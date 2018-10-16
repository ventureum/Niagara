import React, { Component } from 'react'
import { Text, Thumbnail, Icon } from 'native-base'
import { View } from 'react-native'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'
import WebView from 'react-native-android-fullscreen-webview-video'
let moment = require('moment')

export default class VideoFeedCard extends Component {
  render () {
    const { post, url } = this.props
    const key = 'watch?v='
    const offset = url.indexOf(key) + key.length
    const videoID = url.substring(offset)
    return (
      <View style={styles.card} >
        <View style={styles.top}>
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${videoID}?autoplay=0?controls=0?modestbranding=1'` }}
            style={{ alignSelf: 'stretch', height: 300 }}
          />
          <Text style={styles.titleText}>{post.content.title}</Text>
        </View>
        <View style={styles.bottom}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Thumbnail small rounded source={post.photoUrl === ''
              ? { uri: 'https://placeimg.com/120/120/any' }
              : post.photoUrl}
            />
            <View style={{ paddingLeft: ventureum.basicPadding }}>
              <Text style={styles.userNameText}>{post.username}</Text>
              <Text style={styles.timeText}>posted {moment.utc(post.time).fromNow()}</Text>
            </View>
          </View>
          <View style={styles.iconContainer}>
            <Icon
              style={styles.iconStyle}
              type='MaterialIcons'
              name='comment'
            />
            <Text style={styles.iconText}>{post.repliesLength}</Text>
            <Icon
              style={styles.iconStyle}
              type='MaterialCommunityIcons'
              name='fire'
            />
            <Text style={styles.iconText}>
              {post.postVoteCountInfo.totalVoteCount}
            </Text>
          </View>
        </View>
      </View>
    )
  }
}
