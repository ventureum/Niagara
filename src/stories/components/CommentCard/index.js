import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import { Thumbnail, Icon, Toast } from 'native-base'
import styles from './styles'
import Markdown from 'react-native-markdown-renderer'
import SourceBadge from '../SourceBadge'
import { DOWN_VOTE, UP_VOTE } from '../../../utils/constants'
import ventureum from '../../../theme/variables/ventureum'
import ConfirmationModel from '../ConfirmationModal'

let moment = require('moment')
let numeral = require('numeral')
const FORMAT = '0[.]0a'

export default class CommentCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmModalVisible: false,
      action: 0,
      canceled: false,
      post: this.props.post
    }
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
          this.props.voteFeedPost(
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
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Thumbnail small source={{ uri: post.avatar }} />
        </View>
        <View style={styles.ContentContainer}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text
                style={{
                  color: '#aaa',
                  fontSize: 14
                }}
              >
                {'@' + post.username + ' replied:'}
              </Text>
              <Text style={{ fontSize: 12, color: '#aaa' }}>
                {moment.utc(post.time).fromNow()}
              </Text>
            </View>
            <SourceBadge source={post.source} />
          </View>
          <View style={styles.commentContainer} >
            <Markdown> {post.content.text} </Markdown>
          </View>
          <View style={styles.cardFooter}>
            {this.renderVotingInfo(post)}
            {this.renderRewardInfo(post)}
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
      </View >
    )
  }
}
