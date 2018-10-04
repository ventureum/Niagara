import React, { Component } from 'react'
import { View, FlatList } from 'react-native'
import { Text, Content } from 'native-base'
import FeedCardV3 from '../../../components/FeedCardV3'
import VideoFeedCard from '../../../components/VideoFeedCard'
import styles from './styles'

export default class PopularTab extends Component {
  onVoteAction = (postHash, action) => {
    this.props.onVoteAction(postHash, action)
  }

  onRenderItem = ({ item }) => {
    if (item.content.meta !== undefined) {
      const { meta } = item.content
      const metaObject = JSON.parse(meta)
      for (let i = 0; i < metaObject.length; i++) {
        if (metaObject[i].type === 'url') {
          const offset = metaObject[i].offset - 3
          const length = metaObject[i].length
          const url = item.content.text.substring(offset, offset + length)
          if (url.indexOf('youtube') !== -1) {
            return (
              <VideoFeedCard post={item}
                onVoteAction={this.onVoteAction}
                url={url}
              />
            )
          }
        }
      }
    }
    return (
      <FeedCardV3 post={item}
        onVoteAction={this.onVoteAction}
      />
    )
  }

  render () {
    const { posts } = this.props
    return (
      <View style={styles.fill}>
        {posts.length === 0
          ? <Content
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            <Text > No feed information were found. </Text>
          </Content>
          : <FlatList
            data={posts}
            renderItem={this.onRenderItem}
            ref={(ref) => { this.flatListRef = ref }}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
            }}
          />
        }
      </View>
    )
  }
}