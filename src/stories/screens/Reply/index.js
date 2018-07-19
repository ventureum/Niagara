import React, { Component } from 'react'
import { Text, Button, Spinner, Toast } from 'native-base'
import { FlatList, TextInput, View, KeyboardAvoidingView } from 'react-native'
import CommentCard from '../../components/CommentCard'
import FeedCard from '../../components/FeedCard'
import styles from './styles'
import { checkBalanceForTx, getPostTypeHash } from '../../../services/forum'
import WalletUtils from '../../../utils/wallet'

export default class Reply extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      text: null
    })
  }

  onRenderItem = ({ item }) => {
    if (item === this.props.post) {
      return <FeedCard post={item} />
    }
    item = {
      ...item,
      author: WalletUtils.getAddrAbbre(item.author),
      avatar: WalletUtils.getAvatar(item.author)
    }
    return (
      <CommentCard post={item} />
    )
  }

  onSendComment = async () => {
    if (this.state.text !== null) {
      const enoughBalance = await checkBalanceForTx()
      if (enoughBalance) {
        let crypto = require('crypto')
        const { post } = this.props
        const content = {
          title: '',
          text: this.state.text
        }

        await this.props.addContentToIPFS(content)

        const { ipfsPath } = this.props
        let postHash = '0x' + crypto.randomBytes(32).toString('hex')
        const boardId = post.token.address
        const parentHash = post.hash
        const postType = getPostTypeHash('COMMENT')
        await this.props.addPostToForum(boardId, parentHash, postHash, ipfsPath, postType)
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
  }

  render () {
    const { post, replies } = this.props
    let content = [post]
    content = content.concat(replies)
    return (
      <KeyboardAvoidingView enabled style={styles.KeyboardAvoidingView}>
        <View style={styles.contentView}>
          <FlatList
            data={content}
            renderItem={this.onRenderItem}
            keyExtractor={item => item.id}
            onEndReachedThreshold={0.5}
            onEndReached={this.props.getMorePosts}
          />
        </View>
        <View style={styles.footerView}>
          <TextInput style={{ width: '80%' }} placeholder='  Your comments'
            value={this.state.text}
            onChangeText={(text) => { this.setState({ text: text }) }}
          />
          <Button style={{ width: '20%', height: '100%', flex: 1 }} info rounded
            onPress={this.onSendComment}>
            {this.props.loading
              ? <Spinner style={{ alignSelf: 'center' }} color='green' />
              : <Text style={{ alignSelf: 'center', fontWeight: 'bold', fontSize: 17 }}>send</Text>
            }
          </Button>
        </View>
      </KeyboardAvoidingView>
    )
  }
}
