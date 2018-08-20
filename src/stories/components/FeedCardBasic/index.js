import * as React from 'react'

import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native'
import {
  Icon,
  Button,
  Toast
} from 'native-base'
import styles from './styles'
import Markdown from 'react-native-markdown-renderer'
import SourceBadge from '../SourceBadge'
import { DOWN_VOTE, UP_VOTE } from '../../../utils/constants'
import ConfirmationModel from '../../components/ConfirmationModal'

let moment = require('moment')

export default class FeedCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      confirmModalVisible: false,
      action: 0,
      canceled: false
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

  render () {
    let { post } = this.props
    return (
      <TouchableOpacity onPress={() => {
        this.toDetail(post)
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
                  {'@' + post.actor}
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
              <View style={styles.footerIcons}>
                <Button transparent
                  dark
                  onPress={() => {
                    this.setState({
                      confirmModalVisible: !this.state.confirmModalVisible,
                      action: UP_VOTE
                    })
                  }}
                >
                  <Icon name='ios-arrow-up-outline' />
                </Button>
                <Text style={styles.badgeCount}>{post.rewards}</Text>
                <Button transparent
                  dark
                  onPress={() => {
                    this.setState({
                      confirmModalVisible: !this.state.confirmModalVisible,
                      action: DOWN_VOTE
                    })
                  }}
                >
                  <Icon name='ios-arrow-down-outline' />
                </Button>
              </View>
              <View style={styles.footerIcons}>
                <Button
                  transparent
                  dark
                  onPress={() => {
                    this.toDetail(post)
                  }}
                >
                  <Icon name='ios-text-outline' />
                  <Text style={styles.badgeCount}>{post.repliesLength}</Text>
                </Button>
              </View>
            </View>
          </View>
          <ConfirmationModel
            modalVisible={this.state.confirmModalVisible}
            toggleModal={this.toggleConfirmationModal}
            onAction={() => {
              Toast.show({
                text: 'Action sent!',
                buttonText: 'Undo',
                type: 'undo',
                onClose: (reason) => {
                  if (reason === 'timeout') {
                    this.props.updatePostRewards(this.props.boardID, post.postHash, this.state.action)
                  }
                },
                duration: 3000
              })
            }}
          />
        </View>
      </TouchableOpacity>
    )
  }
}
