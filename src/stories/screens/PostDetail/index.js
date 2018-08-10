import React, { Component } from 'react'
import { Fab, Icon } from 'native-base'
import {
  FlatList,
  View,
  KeyboardAvoidingView,
  Text,
  ScrollView,
  RefreshControl
} from 'react-native'
import CommentCard from '../../components/CommentCard'
import FeedCard from '../../components/FeedCard'
import styles from './styles'
import WalletUtils from '../../../utils/wallet'
import MilestoneCard from '../../components/MilestoneCard'

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
    this.props.fetchUserMilstoneData(post.postHash)
  }

  submitPutOption = (postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action) => {
    this.props.processPutOption(postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action, this.onRefresh)
  }

  render () {
    const { post, replies } = this.props
    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading || this.props.milestoneDataLoading}
              onRefresh={() => {
                this.onRefresh()
              }}
            />}
        >
          <View style={styles.header} >
            <View style={styles.headerLeft} >
              <Icon
                active
                name='arrow-back'
                onPress={() => {
                  this.props.navigation.goBack()
                }}
              />
              <Text style={{
                fontWeight: '500',
                fontSize: 18,
                color: '#0f0f0f',
                paddingLeft: 16
              }}> Post </Text>
            </View>
          </View>
          {post.postType === 'MILESTONE'
            ? <View>
              <FeedCard post={post} />
              <MilestoneCard
                milestoneData={this.props.milestoneData}
                submitPutOption={this.submitPutOption}
                postHash={post.postHash}
                milestoneDataLoading={this.props.milestoneDataLoading}
              />
            </View >
            : <FeedCard post={post} />
          }
          <KeyboardAvoidingView enabled>
            <FlatList
              data={replies}
              renderItem={this.onRenderItem}
              keyExtractor={item => item.id}
              onEndReachedThreshold={0.5}
              onEndReached={this.props.getMorePosts}
            />
          </KeyboardAvoidingView >
        </ScrollView>
        <Fab
          active
          containerStyle={{}}
          style={{ backgroundColor: 'red' }}
          position='bottomRight'
          onPress={() => { this.toReply(post) }}>
          <Icon name='ios-list-box-outline' />
        </Fab>
      </View >
    )
  }
}
