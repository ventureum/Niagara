import React, { Component } from 'react'
import { Text, Thumbnail, Icon } from 'native-base'
import { View, TouchableWithoutFeedback } from 'react-native'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'

let moment = require('moment')

export default class FeedCardV3 extends Component {
  render () {
    const { post } = this.props
    return (
      <View style={styles.card} >
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.toPostDetail(post)
          }}
        >
          <View style={styles.top}>
            <Text style={styles.titleText}>{post.content.title}</Text>
            <Text style={styles.subtitleText}>{post.content.subtitle}</Text>
          </View>
        </TouchableWithoutFeedback>
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
