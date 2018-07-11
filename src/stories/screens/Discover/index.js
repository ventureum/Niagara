import React, { Component } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { Container, Body, Header, Left, Right, Button, Icon, Title, Text, Content, Fab, Toast } from 'native-base'
import FeedCard from '../../components/FeedCard'
import WalletUtils from '../../../utils/wallet'
import BoardSearch from '../../components/BoardSearch'
import NewPostModal from '../../components/NewPostModal'
import { checkBalanceForTx } from '../../../services/forum'

console.ignoredYellowBox = ['Setting a timer']

export default class Discover extends Component {
  constructor (props) {
    super(props)
    this.state = {
      boardSearch: false,
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

  onAddNewPost = async (title, text, image) => {
    const enoughBalance = await checkBalanceForTx()
    if (enoughBalance) {
      let crypto = require('crypto')
      const content = {
        title: title,
        text: text,
        image: image
      }

      await this.props.addContentToIPFS(content)

      const { ipfsPath } = this.props
      let postHash = '0x' + crypto.randomBytes(32).toString('hex')
      const boardId = '0x0ba5e3d6ea353a7eae28095f09061ec261c5be59'
      const noParent = '0x0000000000000000000000000000000000000000000000000000000000000000'
      await this.props.addPostToForum(boardId, noParent, postHash, ipfsPath)
      Toast.show({
        type: 'success',
        text: 'Comment Sent Successfully!',
        buttonText: 'Okay',
        position: 'bottom',
        duration: 10000
      })
      this.setState({ text: null })
    } else {
      Toast.show({
        type: 'danger',
        text: 'Insufficient fund!',
        buttonText: 'Okay',
        position: 'bottom',
        duration: 10000
      })
    }
  }

  inBoardSearch = (val) => {
    this.setState({ boardSearch: val })
  }

  getMorePosts = () => {
    this.props.getMorePosts(this.props.boardHash)
  }

  setModalVisible (visible) {
    this.setState({ addNewPost: visible })
  }

  backFromNewPost = async (title, text, image) => {
    if (title !== undefined && text !== undefined) {
      await this.onAddNewPost(title, text, image)
    }
    this.setState({ addNewPost: false })
  }

  render () {
    if (this.state.boardSearch) {
      return (
        <BoardSearch
          goBack={() => {
            this.inBoardSearch(false)
          }}
          switchBoard={this.props.switchBoard}
        />
      )
    } else if (this.state.addNewPost) {
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
              {this.props.boardHash !== 'all'
                ? <Button onPress={() => {
                  this.props.switchBoard('all', 'Feed')
                }}>
                  <Icon name='backspace' />
                </Button>
                : <View />
              }
              <Button onPress={() => this.inBoardSearch(true)} >
                <Icon name='search' />
              </Button>
              <Button onPress={this.onRefresh} >
                <Icon name='refresh' />
              </Button>
            </Right>
          </Header>
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
