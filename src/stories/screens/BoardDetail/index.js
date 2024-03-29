import React, { Component } from 'react'
import { Alert, FlatList, View, RefreshControl, TouchableOpacity, Text } from 'react-native'
import {
  Container,
  Header,
  Icon,
  Content,
  Title
} from 'native-base'
import styles from './styles'
import VideoFeedCard from '../../components/VideoFeedCard'
import FeedCardV3 from '../../components/FeedCardV3'
import ventureum from '../../../theme/variables/ventureum'

console.ignoredYellowBox = ['Setting a timer']

export default class BoardDetail extends Component {
  onRefresh = () => {
    this.props.refreshPosts()
  }

  getMorePosts = () => {
    const { loading } = this.props.boardPosts
    if (!loading) {
      this.props.getMorePosts()
    }
  }

  toPostDetail = (post) => {
    this.props.setCurrentParentPost(post.postHash, 'boardPosts')
    this.props.navigation.navigate('PostDetail', { post })
  }

  onJoin = (boardId) => {
    this.props.followBoards([boardId])
  }

  onUnjoin = (boardId) => {
    this.props.unfollowBoards([boardId])
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
    if (this.props.errorMessage !== '') {
      Alert.alert(
        'Failed',
        this.props.errorMessage,
        [
          { text: 'OK', onPress: () => this.props.resetErrorMessage() }
        ],
        { cancelable: false }
      )
    }
    const { boardPosts, board, userFollowing } = this.props
    const { posts, loading } = boardPosts
    const joined = userFollowing.following.find(item => {
      return item.boardId === board.boardId
    })
    return (
      <Container>
        <Header>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{ marginLeft: ventureum.basicPadding }}>
            <Icon
              name='arrow-back'
              style={{ fontSize: 26, color: ventureum.secondaryColor }}
            />
          </TouchableOpacity>
          <Title>
            {board.boardName}
          </Title>
          {joined ? <TouchableOpacity
            onPress={() => this.onUnjoin(board.boardId)}
            style={{ marginRight: ventureum.basicPadding }}>
            <Text style={styles.joinText}>
              Joined
            </Text>
          </TouchableOpacity>
            : <TouchableOpacity
              onPress={() => this.onJoin(board.boardId)}
              style={{ marginRight: ventureum.basicPadding }}>
              <Text style={styles.joinText}>
                Join
              </Text>
            </TouchableOpacity>
          }
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
