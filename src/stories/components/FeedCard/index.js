import * as React from 'react'

import {
  View,
  Text
} from 'react-native'

import {
  Thumbnail,
  Icon,
  Button
} from 'native-base'
import styles from './styles'
import Markdown from 'react-native-markdown-renderer'
import SourceBadge from '../SourceBadge'
let moment = require('moment')

export default class FeedCard extends React.Component {
  render () {
    let { post } = this.props
    let source
    if (post.source === 'OFF-CHAIN') {
      source = 'Off-Chain'
    } else {
      source = 'On-Chain'
    }
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}>
            <Thumbnail small source={{ uri: post.avatar }} />
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Text
                style={{
                  paddingLeft: 10,
                  color: '#aaa',
                  fontSize: 14
                }}
              >
                {'@' + post.actor}
              </Text>
              <Text style={{ paddingLeft: 10, paddingBottom: 5, fontSize: 13, color: '#aaa' }}>
                {moment.utc(post.time).fromNow()}
              </Text>
            </View>
          </View>
          <SourceBadge source={source} />
        </View>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: 'black'
          }}
        >
          {post.content.title}
        </Text>
        <Markdown >{post.content.text}</Markdown>
        <View style={styles.cardFooter}>
          <View style={styles.footerIcons}>
            <Button transparent
              dark
            >
              <Icon name='ios-heart-outline' />
              <Text style={styles.badgeCount}>{post.rewards}</Text>
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
