import React, { Component } from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { Container, Body, Header, Left, Right, Button, Icon, Title, Text, Content } from 'native-base'
import FeedCard from '../../components/FeedCard'
import WalletUtils from '../../../utils/wallet'
import BoardSearch from '../../components/BoardSearch'

console.ignoredYellowBox = ['Setting a timer']

export default class Discover extends Component {
  constructor (props) {
    super(props)
    this.state = {
      boardSearch: false
    }
  }

  onRefresh = () => {
    this.props.refreshPosts(this.props.boardHash)
    if (this.flatListRef && this.props.posts.length !== 0) {
      this.flatListRef.scrollToIndex({ animated: true, index: 0 })
    }
  }

  toUpvote = () => {
    return null
  }

  toReply (post) {
    this.props.navigation.navigate('Reply', {
      post
    })
  }
  onRenderItem = ({ item }) => {
    item = {
      ...item,
      author: WalletUtils.getAddrAbbre(item.author),
      avatar: WalletUtils.getAvatar(item.author)
    }
    return (
      <FeedCard post={item}
        navigation={this.props.navigation}
        upvote={this.toUpvote}
        feedCardDetails={this.toReply} />
    )
  }

  inBoardSearch = (val) => {
    this.setState({ boardSearch: val })
  }

  getMorePosts = () => {
    this.props.getMorePosts(this.props.boardHash)
  }

  render () {
    if (this.state.boardSearch) {
      return (
        <BoardSearch
          goBack={() => {
            this.inBoardSearch(false)
            this.onRefresh()
          }}
          switchBoard={this.props.switchBoard}
        />
      )
    } else {
      return (
        <Container>
          <Header >
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>Discover</Title>
            </Body>
            <Right>
              <Button onPress={() => this.inBoardSearch(true)} >
                <Icon name='search' />
              </Button>
              <Button onPress={this.onRefresh} >
                <Icon name='refresh' />
              </Button>
            </Right>
          </Header>
          { this.props.posts.length === 0
            ? <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.loading}
                  onRefresh={this.onRefresh}
                />}>
              <Text > No feed information were found. </Text>
            </Content>
            : <FlatList
              data={this.props.posts}
              renderItem={this.onRenderItem}
              ref={(ref) => { this.flatListRef = ref }}
              keyExtractor={item => item.id}
              onEndReachedThreshold={0.5}
              onEndReached={this.getMorePosts}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.loading}
                  onRefresh={this.onRefresh}
                />}
            />
          }
        </Container>
      )
    }
  }
}
