import React, { Component } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { Container, Body, Header, Left, Right, Button, Icon, Title, Text, Content, Fab } from 'native-base'
import FeedCardBasic from '../../components/FeedCardBasic'
import WalletUtils from '../../../utils/wallet'
import Search from '../../../utils/search.js'
import NewPostModal from '../../components/NewPostModal'
import SpecialPostCard from '../../components/SpecialPostCard'
import { getPostTypeHash } from '../../../services/forum'
import { BOARD_ALL_HASH } from '../../../utils/constants.js'

console.ignoredYellowBox = ['Setting a timer']

export default class Discover extends Component {
  constructor (props) {
    super(props)
    this.state = {
      fabActive: false,
      addNewPost: false
    }
  }

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
      actor: WalletUtils.getAddrAbbre(item.actor),
      avatar: WalletUtils.getAvatar(item.actor)
    }
    return (
      <FeedCardBasic post={item}
        navigation={this.props.navigation}
        upvote={this.toUpvote}
        feedCardDetails={this.toReply} />
    )
  }

  toSearchPage = () => {
    this.props.navigation.navigate('SearchPage', {
      search: Search.searchBoards,
      onItemSelected: this.props.switchBoard
    })
  }

  onAddNewPost = async (title, text, image, subtitle, destination) => {
    const content = {
      title: title,
      text: text,
      image: image,
      subtitle: subtitle
    }

    const boardId = this.props.boardHash
    const web3 = WalletUtils.getWeb3Instance()
    const noParent = web3.utils.padRight('0x0', 64)
    const postType = getPostTypeHash('POST')
    await this.props.newPost(content, boardId, noParent, postType, destination)

    this.setState({ text: null })
  }

  getMorePosts = () => {
    this.props.getMorePosts(this.props.boardHash)
  }

  setModalVisible (visible) {
    this.setState({ addNewPost: visible })
  }

  backFromNewPost = async (title, text, image, subtitle, destination) => {
    if (title !== null && text !== null) {
      await this.onAddNewPost(title, text, image, subtitle, destination)
    }
    this.setState({ addNewPost: false })
  }

  render () {
    if (this.state.addNewPost) {
      return (
        <NewPostModal
          goBack={this.backFromNewPost}
          avatar={WalletUtils.getAvatar()}
          loading={this.props.loading}
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
          <SpecialPostCard type='Audits' />
          <SpecialPostCard type='Airdrops' />
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
            active={this.state.fabActive}
            containerStyle={{}}
            style={{ backgroundColor: '#5067FF' }}
            position='bottomRight'
            onPress={() => this.setState({ active: !this.state.fabActive, addNewPost: true })}>
            <Icon name='add' />
          </Fab>
        </Container >
      )
    }
  }
}
