import * as React from 'react'

import {
  View,
  Text
} from 'react-native'

import {
  Icon,
  Button
} from 'native-base'
import styles from './styles'
import Markdown from 'react-native-markdown-renderer'
import SourceBadge from '../SourceBadge'
import { DOWN_VOTE, UP_VOTE } from '../../../utils/constants'
let moment = require('moment')

export default class FeedCard extends React.Component {
  render () {
    let { post } = this.props
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}>
            <View>
              <Text style={styles.title}>
                {post.content.title}
              </Text>
              <Text
                style={{
                  color: '#aaa',
                  fontSize: 14
                }}
              >
                {'@' + post.actor}
              </Text>
              <Text style={{ fontSize: 13, color: '#aaa' }}>
                {moment.utc(post.time).fromNow()}
              </Text>
            </View>
          </View>
          <SourceBadge source={post.source} />
        </View>
        <Markdown>{post.content.text}</Markdown>
        <View style={styles.cardFooter}>
          <View style={styles.footerIcons}>
            <Button transparent
              dark
              onPress={() => {
                this.props.updatePostRewards(this.props.boardID, post.postHash, UP_VOTE)
              }}
            >
              <Icon name='ios-arrow-up-outline' />
            </Button>
            <Text style={styles.badgeCount}>{post.rewards}</Text>
            <Button transparent
              dark
              onPress={() => {
                this.props.updatePostRewards(this.props.boardID, post.postHash, DOWN_VOTE)
              }}
            >
              <Icon name='ios-arrow-down-outline' />
            </Button>
          </View>
          <View style={styles.footerIcons}>
            <Button
              transparent
              dark
            >
              <Icon name='ios-text-outline' />
              <Text style={styles.badgeCount}>{post.repliesLength}</Text>
            </Button>
          </View>
        </View>
      </View>
    )
  }
}
