import * as React from 'react'

import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import {
  Icon,
  Toast
} from 'native-base'
import styles from './styles'
import Markdown from 'react-native-markdown-renderer'
import SourceBadge from '../SourceBadge'
import { DOWN_VOTE, UP_VOTE } from '../../../utils/constants'
import ConfirmationModel from '../../components/ConfirmationModal'
import ventureum from '../../../theme/variables/ventureum'

let moment = require('moment')
let numeral = require('numeral')
const FORMAT = '0[.]0a'

export default class FeedCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmModalVisible: false,
      action: 0,
      canceled: false,
      post: this.props.post
    }
  }

  toDetail = (post) => {
    this.props.navigation.navigate('PostDetail', {
      post
    })
  }

  toggleConfirmationModal = () => {
    this.setState({
      confirmModalVisible: !this.state.confirmModalVisible
    })
  }

  renderVotingInfo = (post) => {
    const { postVoteCountInfo, requestorVoteCountInfo } = post
    return (
      <View style={styles.footerVoteInfo}>
        <TouchableOpacity transparent
          onPress={() => {
            this.props.getVoteCostEstimate(post.postHash)
            this.setState({
              confirmModalVisible: !this.state.confirmModalVisible,
              action: UP_VOTE
            })
          }}
          style={styles.votingButton}
        >
          <Icon
            style={{
              fontSize: 18,
              color: requestorVoteCountInfo.upvoteCount !== 0
                ? ventureum.secondaryColor
                : undefined
            }}
            type='FontAwesome'
            name='thumbs-o-up' />
          <Text style={styles.badgeCount}>
            {numeral(postVoteCountInfo.upvoteCount).format(FORMAT)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity transparent
          onPress={() => {
            this.props.getVoteCostEstimate(post.postHash)
            this.setState({
              confirmModalVisible: !this.state.confirmModalVisible,
              action: DOWN_VOTE
            })
          }}
          style={styles.votingButton}
        >
          <Icon
            name='thumbs-o-down'
            type='FontAwesome'
            style={{
              fontSize: 18,
              color: requestorVoteCountInfo.downvoteCount !== 0
                ? ventureum.errorColor
                : undefined
            }}
          />
          <Text style={styles.badgeCount}>
            {numeral(postVoteCountInfo.downvoteCount).format(FORMAT)}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderRewardInfo = (post) => {
    return (
      <View style={styles.footerRewardInfo}>
        <Icon
          type='MaterialCommunityIcons'
          name='coin'
          style={styles.footerIconStyle}
        />
        <Text style={styles.badgeCount}>{numeral(post.rewards).format(FORMAT)}</Text>
      </View>
    )
  }

  renderReplyInfo = (post) => {
    return (
      <View style={styles.footerReplyInfo}>
        <TouchableOpacity
          transparent
          onPress={() => {
            this.toDetail(post)
          }}
          style={styles.replyButton}
        >
          <Icon
            name='ios-text-outline'
            style={styles.footerIconStyle}
          />
          <Text style={styles.badgeCount}>{numeral(post.repliesLength).format(FORMAT)}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onVoteAction = () => {
    const { post } = this.state
    const { postVoteCountInfo, requestorVoteCountInfo } = post
    if (this.state.action === UP_VOTE) {
      this.setState({
        post: {
          ...post,
          postVoteCountInfo: {
            ...postVoteCountInfo,
            upvoteCount: postVoteCountInfo.upvoteCount + 1,
            totalVoteCount: postVoteCountInfo.totalVoteCount + 1
          },
          requestorVoteCountInfo: {
            ...requestorVoteCountInfo,
            upvoteCount: requestorVoteCountInfo.upvoteCount + 1,
            totalVoteCount: requestorVoteCountInfo.totalVoteCount + 1
          }
        }
      })
    } else if (this.state.action === DOWN_VOTE) {
      this.setState({
        post: {
          ...post,
          postVoteCountInfo: {
            ...postVoteCountInfo,
            downvoteCount: postVoteCountInfo.downvoteCount + 1,
            totalVoteCount: postVoteCountInfo.totalVoteCount + 1
          },
          requestorVoteCountInfo: {
            ...requestorVoteCountInfo,
            downvoteCount: requestorVoteCountInfo.downvoteCount + 1,
            totalVoteCount: requestorVoteCountInfo.totalVoteCount + 1
          }
        }
      })
    }

    Toast.show({
      text: 'Action sent!',
      buttonText: 'Undo',
      type: 'undo',
      onClose: (reason) => {
        if (reason === 'timeout') {
          this.props.updatePostRewards(
            this.props.boardID,
            post.postHash,
            this.state.action
          )
        } else if (reason === 'user') {
          const { post } = this.state
          const { postVoteCountInfo, requestorVoteCountInfo } = post
          if (this.state.action === UP_VOTE) {
            this.setState({
              post: {
                ...post,
                postVoteCountInfo: {
                  ...postVoteCountInfo,
                  upvoteCount: postVoteCountInfo.upvoteCount - 1,
                  totalVoteCount: postVoteCountInfo.totalVoteCount - 1
                },
                requestorVoteCountInfo: {
                  ...requestorVoteCountInfo,
                  upvoteCount: requestorVoteCountInfo.upvoteCount - 1,
                  totalVoteCount: requestorVoteCountInfo.totalVoteCount - 1
                }
              }
            })
          } else if (this.state.action === DOWN_VOTE) {
            this.setState({
              post: {
                ...post,
                postVoteCountInfo: {
                  ...postVoteCountInfo,
                  downvoteCount: postVoteCountInfo.downvoteCount - 1,
                  totalVoteCount: postVoteCountInfo.totalVoteCount - 1
                },
                requestorVoteCountInfo: {
                  ...requestorVoteCountInfo,
                  downvoteCount: requestorVoteCountInfo.downvoteCount - 1,
                  totalVoteCount: requestorVoteCountInfo.totalVoteCount - 1
                }
              }
            })
          }
        }
      },
      duration: 3000
    })
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.loading) {
      return false
    }
    if (nextProps.post.postVoteCountInfo.totalVoteCount !==
      this.state.post.postVoteCountInfo.totalVoteCount) {
      this.setState({ post: nextProps.post })
      return false
    }
    return true
  }

  render () {
    const { post } = this.state
    return (
      <TouchableWithoutFeedback onPress={() => {
        this.props.setCurrentParentPost(post.postHash)
        this.toDetail()
      }}>
        <View style={styles.card}>
          {post.content.image &&
            <Markdown style={styles.md}>{`![user image](${post.content.image})`}</Markdown>
          }
          <View style={styles.header}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start'
            }}>
              <View>
                <Text style={styles.title}>
                  {post.content.title}
                </Text>
                <Text
                  style={{
                    color: '#aaa',
                    fontSize: 14
                  }}
                >
                  {'@' + post.actorAddrAbbre}
                </Text>
                <Text style={{ fontSize: 13, color: '#aaa' }}>
                  {moment.utc(post.time).fromNow()}
                </Text>
              </View>
            </View>
            <SourceBadge source={post.source} />
          </View>
          <View>
            <View style={styles.content}>
              <Markdown>{post.content.subtitle}</Markdown>
            </View>
            <View style={styles.cardFooter}>
              {this.renderVotingInfo(post)}
              {this.renderRewardInfo(post)}
              {this.renderReplyInfo(post)}
            </View>
          </View>
          <ConfirmationModel
            modalVisible={this.state.confirmModalVisible}
            toggleModal={this.toggleConfirmationModal}
            onAction={this.onVoteAction}
            fetchingVoteCost={this.props.fetchingVoteCost}
            voteInfo={this.props.voteInfo}
            voteInfoError={this.props.voteInfoError}
            getVoteCostEstimate={
              () => {
                this.props.getVoteCostEstimate(post.postHash)
              }
            }
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
