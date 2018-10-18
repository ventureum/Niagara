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
    this.props.navigation.navigate('NewPost', { boardHash: this.props.boardHash })
  }

  // getMorePosts = () => {
  //   this.props.getMorePosts(this.props.boardHash, 'popularPosts')
  // }

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
    const { newPosts, popularPosts } = this.props
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
            <Button transparent>
              <Icon
                active
                name='refresh'
                onPress={() => this.onRefresh()}
              />
            </Button>
          </Right>
        </Header>
        <Tabs>
          <Tab heading='POPULAR'>
            <PopularTab
              posts={popularPosts}
              onVoteAction={this.onVoteAction}
              loading={this.props.popularPostsLoading}
              toPostDetail={this.toPostDetail}
            />
          </Tab>
          <Tab heading='NEW'>
            <NewTab
              posts={newPosts}
              onVoteAction={this.onVoteAction}
              loading={this.props.newPostsLoading}
              toPostDetail={this.toPostDetail}
            />
          </Tab>
          <Tab heading='GROUPS'>
            <GroupsTab
              posts={popularPosts}
              onVoteAction={this.onVoteAction}
              loading={this.props.loading}
              toPostDetail={this.toPostDetail}
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
