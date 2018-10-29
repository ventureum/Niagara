import React, { Component } from 'react'
import { Platform, Alert } from 'react-native'
import { Container, Body, Header, Left, Right, Button, Icon, Fab, Tabs, Tab } from 'native-base'
import Search from '../../../utils/search.js'
import ventureum from '../../../theme/variables/ventureum'
import PopularTab from './Popular'
import NewTab from './New'
import GroupsTab from './Groups'

console.ignoredYellowBox = ['Setting a timer']

export default class Discover extends Component {
  onRefresh = () => {
    this.props.refreshPosts()
  }

  toSearchPage = () => {
    this.props.navigation.navigate('SearchPage', {
      search: Search.searchBoards,
      onItemSelected: this.props.switchBoard
    })
  }

  toNewPost = () => {
    this.props.navigation.navigate('NewPost', {
      boardId: this.props.boardId,
      refreshCallback: this.onRefresh
    })
  }

  toBoardDetail = (board) => {
    this.props.navigation.navigate('BoardDetail', { board: board })
  }

  getMorePosts = (targetArray) => {
    this.props.getMorePosts(targetArray)
  }

  onVoteAction = (postHash, action) => {
    this.props.voteFeedPost(postHash, action)
  }

  toPostDetail = (post, targetArray) => {
    this.props.setCurrentParentPost(post.postHash, targetArray)
    this.props.navigation.navigate('PostDetail')
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
    const { newPosts, popularPosts, userFollowing, boards } = this.props
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
        <Tabs>
          <Tab heading='POPULAR'>
            <PopularTab
              popularPosts={popularPosts}
              toPostDetail={this.toPostDetail}
              getMorePosts={this.getMorePosts}
            />
          </Tab>
          <Tab heading='NEW'>
            <NewTab
              newPosts={newPosts}
              toPostDetail={this.toPostDetail}
              getMorePosts={this.getMorePosts}
            />
          </Tab>
          <Tab heading='GROUPS'>
            <GroupsTab
              userFollowing={userFollowing}
              toBoardDetail={this.toBoardDetail}
              boards={boards}
            />
          </Tab>
        </Tabs>
        <Fab
          active
          containerStyle={{}}
          style={{ backgroundColor: ventureum.lightSecondaryColor }}
          position='bottomLeft'
          onPress={this.toNewPost}>
          <Icon name='add' style={{ fontSize: Platform.OS === 'ios' ? 40 : 30, lineHeight: 40, paddingTop: Platform.OS === 'ios' ? 5 : 0 }} />
        </Fab>
      </Container >
    )
  }
}
