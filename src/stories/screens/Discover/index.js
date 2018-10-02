import React, { Component } from 'react'
import { FlatList, RefreshControl, View, Platform, Alert } from 'react-native'
import { Container, Body, Header, Left, Right, Button, Icon, Title, Text, Content, Fab } from 'native-base'
import FeedCardBasic from '../../components/FeedCardBasic'
import Search from '../../../utils/search.js'
import SpecialPostCard from '../../components/SpecialPostCard'
import { BOARD_ALL_HASH } from '../../../utils/constants.js'
import ventureum from '../../../theme/variables/ventureum'

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
    return (
      <FeedCardBasic post={item}
        navigation={this.props.navigation}
        updatePostRewards={this.props.updatePostRewards}
        boardID={this.props.boardHash}
        getVoteCostEstimate={this.props.getVoteCostEstimate}
        fetchingVoteCost={this.props.fetchingVoteCost}
        voteInfo={this.props.voteInfo}
        voteInfoError={this.props.voteInfoError}
        setCurrentParentPost={this.props.setCurrentParentPost}
        loading={this.props.loading}
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
    return (
      <Container>
        <Header >
          <Left>
            <Button transparent>
              <Icon
                active
                name='menu'
                onPress={() => this.props.navigation.openDrawer()}
              />
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
            <Button transparent onPress={this.toSearchPage} >
              <Icon name='search' />
            </Button>
            <Button transparent onPress={this.onRefresh} >
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
          : null}
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
          style={{ backgroundColor: ventureum.lightSecondaryColor }}
          position='bottomRight'
          onPress={this.toNewPost}>
          <Icon name='add' style={{ fontSize: Platform.OS === 'ios' ? 40 : 30, lineHeight: 40, paddingTop: Platform.OS === 'ios' ? 5 : 0 }} />
        </Fab>
      </Container >
    )
  }
}
