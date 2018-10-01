import React, { Component } from 'react'
import { FlatList, RefreshControl, View, Platform, Alert, Modal, TouchableWithoutFeedback } from 'react-native'
import { Container, Body, Header, Left, Right, Button, Icon, Title, Text, Content, Fab, Tabs, Tab } from 'native-base'
import FeedCardBasic from '../../components/FeedCardBasic'
import Search from '../../../utils/search.js'
import ventureum from '../../../theme/variables/ventureum'
import PopularTab from './Popular'
import NewTab from './New'
import GroupsTab from './Groups'

console.ignoredYellowBox = ['Setting a timer']

export default class Discover extends Component {
  onRefresh = () => {
    this.props.refreshPosts(this.props.boardHash)
    // if (this.flatListRef && this.props.posts.length !== 0) {
    //   this.flatListRef.scrollToIndex({ animated: true, index: 0 })
    // }
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

  onVoteAction = (postHash, action) => {
    this.props.voteFeedPost(postHash, action)
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
    const { posts } = this.props
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
              posts={posts}
              onVoteAction={this.onVoteAction}
            />
          </Tab>
          <Tab heading='NEW'>
            <NewTab
              posts={posts}
              onVoteAction={this.onVoteAction}
            />
          </Tab>
          <Tab heading='GROUPS'>
            <GroupsTab
              posts={posts}
              onVoteAction={this.onVoteAction}
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
