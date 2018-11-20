import React, { Component } from 'react'
import { FlatList, View, RefreshControl } from 'react-native'
import {
  Container,
  Body,
  Header,
  Left,
  Right,
  Button,
  Icon,
  Content,
  Text
} from 'native-base'
import styles from './styles'
import VideoFeedCard from '../../components/VideoFeedCard'
import FeedCardV3 from '../../components/FeedCardV3'

console.ignoredYellowBox = ['Setting a timer']

export default class Discover extends Component {
  onRefresh = () => {
    this.props.refreshPosts(this.props.actor, 'homePosts')
  }

  getMorePosts = () => {
    const { loading } = this.props.homePosts
    if (!loading) {
      this.props.getMorePosts()
    }
  }

  onVoteAction = (postHash, action) => {
    this.props.voteFeedPost(postHash, action)
  }

  toPostDetail = (post) => {
    this.props.setCurrentParentPost(post.postHash, 'homePosts')
    this.props.navigation.navigate('PostDetail', { post })
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
                toPostDetail={this.toPostDetail}
              />
            )
          }
        }
      }
    }
    return (
      <FeedCardV3 post={item}
        onVoteAction={this.onVoteAction}
        toPostDetail={this.toPostDetail}
      />
    )
  }

  render () {
    const { homePosts } = this.props
    const { posts, loading } = homePosts
    return (
      <Container>
        <Header >
          <Left>
            <Button transparent>
              <Icon
                active
                name='search'
              />
            </Button>
          </Left>
          <Body />
          <Right>
            <Button transparent
              onPress={() => this.onRefresh()}>
              <Icon
                active
                name='refresh'
              />
            </Button>
          </Right>
        </Header>
        <View style={styles.fill}>
          {(posts.length === 0 && !loading)
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
                this.getMorePosts()
              }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={this.onRefresh}
                />
              }
            />
          }
        </View>
      </Container >
    )
  }
}
