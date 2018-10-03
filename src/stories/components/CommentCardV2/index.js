import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, Thumbnail, Icon, ActionSheet } from 'native-base'
import styles from './styles'
let moment = require('moment')
const options = [
  {text: 'Reply'},
  {text: 'Report'}
]
export default class CommentCardV2 extends Component {
  render () {
    const { post } = this.props
    const { downvoteCount, upvoteCount } = post.postVoteCountInfo
    return (
      <View style={styles.container}>
        <View style={styles.header} >
          <Thumbnail tiny rounded source={post.photoUrl === ''
            ? { uri: 'https://placeimg.com/120/120/any' }
            : post.photoUrl}
          />
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.time}>{moment.utc(post.time).fromNow()}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.bodyText}>
            {post.content.text}
          </Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.buttonContainer}>
            <Icon type='Ionicons'
              name='md-thumbs-up'
              style={styles.icon}
            />
            <Text style={styles.iconText}>
              {upvoteCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>
            <Icon type='Ionicons'
              name='md-thumbs-down'
              style={styles.icon}
            />
            <Text style={styles.iconText}>
              {downvoteCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
              height: 32,
              width: 24
            }}
            onPress={() => {
              ActionSheet.show({
                options: options
              },
              buttonIndex => {
                if (buttonIndex === 0) {
                  this.props.onReplyPress(post)
                }
              })
            }}
          >
            <Icon type='Ionicons'
              name='md-more'
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
