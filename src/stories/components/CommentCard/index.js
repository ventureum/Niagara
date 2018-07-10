import * as React from 'react'

import {
  View,
  Text,
  TouchableHighlight,
  Image
} from 'react-native'

import {
  Thumbnail,
  Icon,
  Button
} from 'native-base'
import styles from './styles'

export default class CommentCard extends React.Component {
  render () {
    let { post } = this.props
    return (
      <View style={styles.card}>
        <TouchableHighlight
          underlayColor='white'
          activeOpacity={0.75}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Thumbnail source={{ uri: post.avatar }} />
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}
            >
              <Text
                style={{
                  paddingLeft: 15,
                  fontWeight: 'bold',
                  fontSize: 20
                }}
              >
                { post.content.title }
              </Text>

              <Text
                style={{
                  paddingLeft: 15,
                  color: '#aaa',
                  fontSize: 16
                }}
              >
                {'@' + post.author}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
        <Image source={{uri: post.content.image}} style={{height: 400, width: null}} />
        <Text style={styles.cardText}>{post.content.text}</Text>
      </View>
    )
  }
}
