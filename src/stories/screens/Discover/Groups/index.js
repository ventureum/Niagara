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
  renderList = (userFollowing) => {
    const list = userFollowing.map((item, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => {
          this.props.toBoardDetail(item.boardId)
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
    console.log(this.props)
    return (
      <View>
        <ScrollView>
          {this.renderList(userFollowing)}
        </ScrollView>
        <ActivityIndicator
          color={ventureum.secondaryColor}
          style={{
            position: 'absolute',
            top: height / 10,
            left: (width / 2) - 16
          }}
          size='large'
          animating={this.props.loading}
        />
      </View>

    )
  }
}
