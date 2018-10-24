import React, { Component } from 'react'
import {
  View,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { Text } from 'native-base'
import ventureum from '../../../../theme/variables/ventureum'
import styles from './styles'
const { height, width } = Dimensions.get('screen')

export default class GroupsTab extends Component {
  renderList = (following) => {
    const list = following.map((item, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => {
          this.props.toBoardDetail(item)
        }}>
          <View style={styles.container}>
            <View style={styles.initialsContainer}>
              <Text style={styles.initials}>{item.nameInitials}</Text>
            </View>
            <Text style={styles.boardName}>
              {item.boardName}
            </Text>
          </View>
        </TouchableOpacity>
      )
    })
    return list
  }

  render () {
    const { userFollowing } = this.props
    const { following, loading } = userFollowing
    return (
      <View>
        <ScrollView>
          {this.renderList(following)}
        </ScrollView>
        <ActivityIndicator
          color={ventureum.secondaryColor}
          style={{
            position: 'absolute',
            top: height / 10,
            left: (width / 2) - 16
          }}
          size='large'
          animating={loading}
        />
      </View>

    )
  }
}
