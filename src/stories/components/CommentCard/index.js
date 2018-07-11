import * as React from 'react'

import {
  View,
  Text,
  Image
} from 'react-native'

import { Thumbnail } from 'native-base'
import styles from './styles'

export default class CommentCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = ({
      height: 10,
      width: 10,
      viewWidth: 10,
      viewUpdated: false
    })
  }

  componentWillMount () {
    let { post } = this.props
    if (post.content.image !== undefined) {
      Image.getSize(post.content.image, (width, height) => {
        this.setState({ height: height, width: width })
      })
    }
  }

  render () {
    let { post } = this.props
    return (
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Thumbnail small source={{ uri: post.avatar }} />
        </View>
        <View style={styles.ContentContainer}>
          <View style={styles.authorContainer}>
            <Text
              style={{
                color: '#aaa',
                fontSize: 16
              }}
            >
              {'@' + post.author + ' replied:'}
            </Text>
          </View>
          <View style={styles.commentContainer} onLayout={(event) => {
            if (this.state.viewUpdated === false) {
              this.setState({ viewWidth: event.nativeEvent.layout.width, viewUpdated: true })
            }
          }}>
            <Image source={{ uri: post.content.image }} style={{ height: this.state.height * (this.state.viewWidth / this.state.width), resizeMode: 'contain' }} />
            <Text style={{ fontSize: 18 }}>{post.content.text}</Text>
          </View>
        </View>
      </View >
    )
  }
}
