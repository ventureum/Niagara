import React, { Component } from 'react'
import { Icon, Left, Right, Header, Body, Container, Button, Text, Toast } from 'native-base'
import {
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity
} from 'react-native'
import CommentCardV2 from '../../components/CommentCardV2'
import ventureum from '../../../theme/variables/ventureum'
import ArticleDetailsCard from '../../components/ArticleDetailsCard'
import VideoDetailsCard from '../../components/VideoDetailsCard'
import ReplyModal from '../../components/ReplyModal'
import { processContent } from '../../../utils/content'
import { UP_VOTE, DOWN_VOTE } from '../../../utils/constants'
import styles from './styles'

export default class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      modalVisible: false,
      replyingTo: this.props.post
    })
  }

  onVoteAction = (postHash, action) => {
    if (postHash === this.props.post.postHash) {
      this.props.voteFeedPost(postHash, action)
    } else {
      this.props.voteFeedReply(postHash, action)
    }
  }

  commentDivider = () => {
    const { repliesLength } = this.props.post
    return (
      <View style={styles.commentDivider}>
        <Text style={styles.commentDividerText}>
          Comments({repliesLength})
        </Text>
      </View>
    )
  }

  flattenList = (List) => {
    let newList = []
    List.forEach(item => {
      let subList = item.replies
      newList.push(item)
      if (subList.length !== 0) {
        newList = newList.concat(this.flattenList(subList))
      }
    })
    return newList
  }

  toggleReplyModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  onReplyToComment = (post) => {
    this.setState({
      replyingTo: post,
      modalVisible: true
    })
  }

  onSubmitComment = (comment) => {
    this.setState({
      modalVisible: false
    })

    if (this.state.text !== null) {
      const content = processContent('', comment)
      if (content === false) {
        Toast.show({
          text: 'Invalid text detected',
          position: 'center',
          buttonText: 'Okay',
          type: 'danger',
          duration: 10000
        })
        return
      }
      const destination = 'OFF-CHAIN'
      const boardId = this.props.boardId
      const parentHash = this.state.replyingTo.postHash
      const postType = 'COMMENT'
      this.props.newPost(content, boardId, parentHash, postType, destination, this.onRefresh)
    }
  }

  renderHeader = () => {
    return (
      <Header>
        <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name='arrow-back' />
          </Button>
        </Left>
        <Body />
        <Right />
      </Header>
    )
  }

  onRenderItem = ({ item }) => {
    const parentPost = this.props.post
    if (item.postHash === parentPost.postHash) {
      if (item.content.meta !== undefined) {
        const { meta } = item.content
        const metaObject = JSON.parse(meta)
        for (let i = 0; i < metaObject.length; i++) {
          if (metaObject[i].type === 'url') {
            const offset = metaObject[i].offset - 3
            const length = metaObject[i].length
            const url = item.content.text.substring(offset, offset + length)
            if (url.indexOf('youtube') !== -1) {
              return (
                <View>
                  {this.renderHeader()}
                  <VideoDetailsCard
                    post={item}
                    onVoteAction={this.onVoteAction}
                    url={url}
                  />
                </View>
              )
            }
          }
        }
      }
      return (
        <View>
          {this.renderHeader()}
          <ArticleDetailsCard
            post={item}
            onVoteAction={this.onVoteAction}
          />
        </View>
      )
    } else if (item.commentDivider) {
      return this.commentDivider()
    }
    return (
      <CommentCardV2
        post={item}
        voteFeedPost={this.props.voteFeedPost}
        getVoteCostEstimate={this.props.getVoteCostEstimate}
        fetchingVoteCost={this.props.fetchingVoteCost}
        voteInfo={this.props.voteInfo}
        voteInfoError={this.props.voteInfoError}
        loading={this.props.loading}
        onReplyPress={this.onReplyToComment}
        onVoteAction={this.onVoteAction}
      />
    )
  }

  renderFooter = (post) => {
    const { postVoteCountInfo, repliesLength, requestorVoteCountInfo } = post
    return (
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              replyingTo: this.props.post,
              modalVisible: true
            })
          }}
          style={styles.commentButton}
        >
          <Text style={styles.commentPlaceHolder}>Add comment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.onVoteAction(post.postHash, UP_VOTE)
          }}
        >
          <View style={styles.iconContainer}>
            <Icon
              style={{
                fontSize: 20,
                color: requestorVoteCountInfo.upvoteCount === 0
                  ? ventureum.defaultIconColor
                  : ventureum.lightSecondaryColor
              }}
              type='Ionicons'
              name='md-thumbs-up'
            />
            <Text style={styles.iconText}>{postVoteCountInfo.upvoteCount}</Text>
          </View>

        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.onVoteAction(post.postHash, DOWN_VOTE)
          }}>
          <View style={styles.iconContainer}>
            <Icon
              style={{
                fontSize: 20,
                color: requestorVoteCountInfo.downvoteCount === 0
                  ? ventureum.defaultIconColor
                  : ventureum.lightSecondaryColor
              }}
              type='Ionicons'
              name='md-thumbs-down'
            />
            <Text style={styles.iconText}>{postVoteCountInfo.downvoteCount}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.scrollToComment()
          }}
        >
          <View style={styles.iconContainer}>
            <Icon
              style={styles.iconStyle}
              type='MaterialIcons'
              name='comment'
            />
            <Text style={styles.iconText}>{repliesLength}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }}
          style={styles.iconContainer}
        >
          <Icon
            style={styles.iconStyle}
            type='Ionicons'
            name='md-more'
          />
        </TouchableOpacity>
      </View>
    )
  }

  scrollToComment = () => {
    this.flatListRef.scrollToIndex({
      animated: true,
      index: 1,
      viewOffset: 0,
      viewPosition: 0
    })
  }

  toReply = (post) => {
    this.props.navigation.navigate('Reply', { post })
  }

  onRefresh = () => {
    const { post } = this.props
    this.props.refreshViewingPost(post.postHash)
  }

  render () {
    const { post, replies } = this.props
    const repliesCopy = JSON.parse(JSON.stringify(replies))
    const repliesReversed = repliesCopy.reverse()
    let flattenReplies = this.flattenList(repliesReversed)
    const commentDivider = { commentDivider: true, id: '-200' }
    const mergedList = [post, commentDivider, ...flattenReplies]
    return (
      <Container>
        <FlatList
          ref={(ref) => { this.flatListRef = ref }}
          data={mergedList}
          renderItem={this.onRenderItem}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.5}
          onEndReached={this.props.getMorePosts}
          extraData={[this.props, this.state]}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this.onRefresh}
            />
          }
        />
        {this.renderFooter(post)}
        <ReplyModal
          modalVisible={this.state.modalVisible}
          toggleReplyModal={this.toggleReplyModal}
          onSubmitComment={this.onSubmitComment}
          inputPlaceholder={this.state.replyingTo.postHash === post.postHash
            ? 'Add comment'
            : 'Replying to ' + this.state.replyingTo.username}
        />
      </Container>
    )
  }
}
