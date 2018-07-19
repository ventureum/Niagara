import * as React from 'react'

import {
  View,
  Text,
  TouchableHighlight
} from 'react-native'

import {
  Thumbnail,
  Icon,
  Button
} from 'native-base'
import styles from './styles'
import Markdown from 'react-native-markdown-renderer'
let moment = require('moment')

export default class FeedCard extends React.Component {
  render () {
    let { post } = this.props
    return (
      <View style={styles.card}>
        <TouchableHighlight
          underlayColor='white'
          activeOpacity={0.75}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Thumbnail source={{ uri: post.avatar }} />
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}
            >
              <Text
                style={{
                  paddingLeft: 15,
                  fontWeight: 'bold',
                  fontSize: 20
                }}
              >
                { post.content.title }
              </Text>

              <Text
                style={{
                  paddingLeft: 15,
                  color: '#aaa',
                  fontSize: 16
                }}
              >
                {'@' + post.author}
              </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}>
              <Text style={{paddingLeft: 10, paddingBottom: 10, fontSize: 13, color: '#aaa'}}>
                {moment.utc(post.time).fromNow()}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
        <Markdown>{post.content.text}</Markdown>
        <View style={styles.cardFooter}>
          <View style={styles.footerIcons}>
            <Button transparent
              dark
              onPress={this.props.feedCardDetails === undefined ? () => {} : this.props.upvote.bind(this, post)}
            >
              <Icon name='ios-heart-outline' />
              <Text style={styles.badgeCount}>{post.rewards} {post.token.symbol}</Text>
            </Button>
          </View>
          <View style={styles.footerIcons}>
            <Button
              transparent
              dark
              onPress={this.props.feedCardDetails === undefined ? () => {} : this.props.feedCardDetails.bind(this, post)}
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
