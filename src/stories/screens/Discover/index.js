import React, { Component } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { Container, Body, Header, Left, Right, Button, Icon, Title, Text, Content, Fab } from 'native-base'
import FeedCardBasic from '../../components/FeedCardBasic'
import WalletUtils from '../../../utils/wallet'
import Search from '../../../utils/search.js'
import SpecialPostCard from '../../components/SpecialPostCard'
import { BOARD_ALL_HASH } from '../../../utils/constants.js'

console.ignoredYellowBox = ['Setting a timer']

export default class Discover extends Component {
  componentWillReceiveProps (nextProps) {
    if (this.props.boardHash !== nextProps.boardHash) {
      this.props.refreshPosts(nextProps.boardHash)
    }
  }

  onRefresh = () => {
    this.props.refreshPosts(this.props.boardHash)
    if (this.flatListRef && this.props.posts.length !== 0) {
      this.flatListRef.scrollToIndex({ animated: true, index: 0 })
    }
  }

  onRenderItem = ({ item }) => {
    item = {
      ...item,
      actor: WalletUtils.getAddrAbbre(item.actor),
      avatar: WalletUtils.getAvatar(item.actor)
    }
    return (
      <FeedCardBasic post={item}
        navigation={this.props.navigation}
      />
    )
  }

  toSearchPage = () => {
    this.props.navigation.navigate('SearchPage', {
      search: Search.searchBoards,
      onItemSelected: this.props.switchBoard
    })
  }

  toNewPost = () => {
    this.props.navigation.navigate('NewPost', { boardHash: this.props.boardHash })
  }

  getMorePosts = () => {
    this.props.getMorePosts(this.props.boardHash)
  }

  backFromNewPost = async (title, text, image, subtitle, destination) => {
    if (title !== null && text !== null) {
      await this.onAddNewPost(title, text, image, subtitle, destination)
    }
    this.setState({ addNewPost: false })
  }

  render () {
    return (
      <Container>
        <Header >
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.boardName}</Title>
          </Body>
          <Right>
            {this.props.boardHash !== BOARD_ALL_HASH
              ? <Button onPress={() => {
                this.props.switchBoard('All', BOARD_ALL_HASH)
              }}>
                <Icon name='backspace' />
              </Button>
              : <View />
            }
            <Button onPress={this.toSearchPage} >
              <Icon name='search' />
            </Button>
            <Button onPress={this.onRefresh} >
              <Icon name='refresh' />
            </Button>
          </Right>
        </Header>
        {this.props.boardHash !== BOARD_ALL_HASH
          ? (
            <View>
              <SpecialPostCard type='Audits' />
              <SpecialPostCard type='Airdrops' />
            </View>)
          : (<View />)}
        {
          this.props.posts.length === 0
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
        <Fab
          active
          containerStyle={{}}
          style={{ backgroundColor: '#5067FF' }}
          position='bottomRight'
          onPress={this.toNewPost}>
          <Icon name='add' />
        </Fab>
      </Container >
    )
  }
}
