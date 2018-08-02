import React, { Component } from 'react'
import { Fab, Icon } from 'native-base'
import { FlatList, View, KeyboardAvoidingView } from 'react-native'
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
    if (item === this.props.post) {
      if (item.postType === 'MILESTONE') {
        return (
          <View>
            <FeedCard post={item} />
            <MilestoneCard
              milestoneData={this.props.milestoneData}
              processPutOption={this.props.processPutOption}
              postHash={item.postHash}
            />
          </View >
        )
      } else {
        return (
          <FeedCard post={item} />
        )
      }
    }
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

  render () {
    const { post, replies } = this.props
    let content = [post]
    content = content.concat(replies)
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView enabled>
          <FlatList
            data={content}
            renderItem={this.onRenderItem}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0.5}
            onEndReached={this.props.getMorePosts}
          />
        </KeyboardAvoidingView >
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
