import * as React from 'react'

import {
  View,
  Text,
  TouchableWithoutFeedback
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
        <View style={styles.header}>
          <Thumbnail source={{ uri: post.avatar }} />
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
              {'@' + post.author}
            </Text>
            <Text style={{ paddingLeft: 10, paddingBottom: 5, fontSize: 13, color: '#aaa' }}>
              {moment.utc(post.time).fromNow()}
            </Text>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={this.props.feedCardDetails.bind(this, post)}>
          <View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: 'black',
                paddingLeft: 10
              }}
            >
              {post.content.title}
            </Text>
            {(post.content.image === undefined)
              ? <Markdown >{post.content.subtitle}</Markdown>
              : <Markdown >{`![user image](${post.content.image})\n\n${post.content.subtitle}`}</Markdown>
            }
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.cardFooter}>
          <View style={styles.footerIcons}>
            <Button transparent
              dark
              onPress={this.props.upvote.bind(this, post)}
            >
              <Icon name='ios-heart-outline' />
              <Text style={styles.badgeCount}>{post.rewards} {post.token.symbol}</Text>
            </Button>
          </View>
          <View style={styles.footerIcons}>
            <Button
              transparent
              dark
              onPress={this.props.feedCardDetails.bind(this, post)}
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
