import React, { Component } from 'react'
import { Text, Thumbnail } from 'native-base'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'
import VoteBubble from '../VoteBubble'
import { UP_VOTE } from '../../../utils/constants'
import WebView from 'react-native-android-fullscreen-webview-video'
let moment = require('moment')

export default class VideoFeedCard extends Component {
  constructor (props) {
    super(props)
    const { requestorVoteCountInfo } = this.props.post
    this.state = {
      voteBubbleVisible: false,
      voteBubbleX: 0,
      voteBubbleY: 0,
      upVotable: requestorVoteCountInfo.upvoteCount === 0,
      downVotable: requestorVoteCountInfo.downvoteCount === 0
    }
  }

  onVotePress = (x, y) => {
    this.setState({
      voteBubbleVisible: true,
      voteBubbleX: x,
      voteBubbleY: y
    })
  }

  toggleVoteBubble = () => {
    this.setState({
      voteBubbleVisible: !this.state.voteBubbleVisible
    })
  }

  onVoteAction = (action) => {
    action === UP_VOTE
      ? this.setState({ upVotable: false })
      : this.setState({ downVotable: false })

    this.props.onVoteAction(this.props.post.postHash, action)
    this.toggleVoteBubble()
  }

  render () {
    const { post, url } = this.props
    const key = 'watch?v='
    const offset = url.indexOf(key) + key.length
    const videoID = url.substring(offset)
    return (
      <View style={styles.card} >
        <View style={styles.top}>
          <WebView
            source={{ uri: `https://www.youtube.com/embed/${videoID}?autoplay=0?controls=0?modestbranding=1'` }}
            style={{ alignSelf: 'stretch', height: 300 }}
          />
          <Text style={styles.titleText}>{post.content.title}</Text>
        </View>
        <View style={styles.bottom}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Thumbnail small rounded source={post.photoUrl === ''
              ? { uri: 'https://placeimg.com/120/120/any' }
              : post.photoUrl}
            />
            <View style={{ paddingLeft: ventureum.basicPadding }}>
              <Text style={styles.userNameText}>{post.username}</Text>
              <Text style={styles.timeText}>posted {moment.utc(post.time).fromNow()}</Text>
            </View>
          </View>
          <View>
            <TouchableOpacity style={styles.voteButton}
              onPress={(event) => {
                const target = event.nativeEvent
                this.onVotePress(
                  target.pageX - target.locationX,
                  target.pageY - target.locationY
                )
              }}>
              <Text style={styles.voteText}>VOTE</Text>
            </TouchableOpacity>
          </View>
        </View>
        <VoteBubble
          toggleVoteBubble={this.toggleVoteBubble}
          voteBubbleVisible={this.state.voteBubbleVisible}
          onVoteAction={this.onVoteAction}
          upVotable={this.state.upVotable}
          downVotable={this.state.downVotable}
          x={this.state.voteBubbleX}
          y={this.state.voteBubbleY}
        />
      </View>
    )
  }
}