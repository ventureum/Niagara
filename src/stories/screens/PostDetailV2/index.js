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
import ReplyModal from '../../components/ReplyModal'
import { processContent } from '../../../utils/content'
import styles from './styles'

export default class PostDetail extends Component {
  constructor (props) {
    super(props)
    this.state = ({
      modalVisible: false,
      replyingTo: this.props.post
    })
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
      const boardId = this.props.boardHash
      const parentHash = this.state.replyingTo.postHash
      const postType = 'COMMENT'
      this.props.newPost(content, boardId, parentHash, postType, destination)
    }
  }

  onRenderItem = ({ item }) => {
    const parentPost = this.props.post
    if (item.postHash === parentPost.postHash) {
      return (
        <View>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Body />
            <Right />
          </Header>
          <ArticleDetailsCard
            post={item}
          />
          {this.commentDivider()}
        </View>
      )
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
        <TouchableOpacity onPress={() => { }}
          style={styles.iconContainer}
        >
          <Icon
            style={{
              fontSize: 24,
              color: requestorVoteCountInfo.upvoteCount === 0
                ? ventureum.defaultIconColor
                : ventureum.lightSecondaryColor
            }}
            type='Ionicons'
            name='md-thumbs-up'
          />
          <Text style={styles.iconText}>{postVoteCountInfo.upvoteCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }}
          style={styles.iconContainer}>
          <Icon
            style={{
              fontSize: 24,
              color: requestorVoteCountInfo.downvoteCount === 0
                ? ventureum.defaultIconColor
                : ventureum.lightSecondaryColor
            }}
            type='Ionicons'
            name='md-thumbs-down'
          />
          <Text style={styles.iconText}>{postVoteCountInfo.downvoteCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            this.scrollToComment()
          }}
        >
          <Icon
            style={styles.iconStyle}
            type='MaterialIcons'
            name='comment'
          />
          <Text style={styles.iconText}>{repliesLength}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { }}
          style={styles.iconContainer}
        >
          <Icon
            style={{ ...styles.iconStyle, marginLeft: 12 }}
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
    const mergedList = [post, ...flattenReplies]
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
