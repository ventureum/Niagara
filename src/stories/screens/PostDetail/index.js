import React, { Component } from 'react'
import { Fab, Content, Icon, Left, Right, Header, Body, Container, Button, Title } from 'native-base'
import {
  FlatList,
  View,
  KeyboardAvoidingView,
  RefreshControl
} from 'react-native'
import CommentCard from '../../components/CommentCard'
import FeedCard from '../../components/FeedCard'
import styles from './styles'
import WalletUtils from '../../../utils/wallet'
import MilestoneCard from '../../components/MilestoneCard'
import ActiveSession from '../../components/ActiveSession'

export default class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      text: null
    })
  }

  onRenderItem = ({ item }) => {
    item = {
      ...item,
      actor: WalletUtils.getAddrAbbre(item.actor),
      avatar: WalletUtils.getAvatar(item.actor)
    }
    return (
      <CommentCard post={item} />
    )
  }

  toReply = (post) => {
    this.props.navigation.navigate('Reply', { post })
  }

  onRefresh = () => {
    const { post } = this.props
    this.props.getReplies(post.postHash)
    if (post.postType === 'MILESTONE') {
      this.props.fetchUserMilstoneData(post.postHash)
    }
  }

  submitPutOption = (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action) => {
    this.props.processPutOption(postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, this.onRefresh)
  }

  render () {
    const { post, replies } = this.props
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Post</Title>
          </Body>
          <Right />
        </Header>
        <Content
          style={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading || this.props.milestoneDataLoading}
              onRefresh={() => {
                this.onRefresh()
              }}
            />}
          contentContainerStyle={styles.scrolViewContainer}
        >
          {post.postType === 'MILESTONE'
            ? <View>
              <FeedCard
                post={post}
                updatePostRewards={this.props.updatePostRewards}
              />
              <MilestoneCard
                milestoneData={this.props.milestoneData}
                submitPutOption={this.submitPutOption}
                postHash={post.postHash}
                milestoneDataLoading={this.props.milestoneDataLoading}
              />
            </View>
            : <FeedCard
              post={post}
              updatePostRewards={this.props.updatePostRewards}
            />
          }
          {post.endTime === undefined
            ? <ActiveSession
              onPress={() => {
                this.props.navigation.navigate('ChatPage', { post, replies })
              }} />
            : <KeyboardAvoidingView enabled>
              <FlatList
                data={replies}
                renderItem={this.onRenderItem}
                keyExtractor={item => item.id}
                onEndReachedThreshold={0.5}
                onEndReached={this.props.getMorePosts}
              />
            </KeyboardAvoidingView >
          }
        </Content>
        <Fab
          active
          containerStyle={{}}
          style={{ backgroundColor: 'red' }}
          position='bottomRight'
          onPress={() => { this.toReply(post) }}>
          <Icon name='ios-list-box-outline' />
        </Fab>
      </Container>
    )
  }
}
