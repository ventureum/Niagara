
import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import styles from './styles'

export default class ActiveSession extends Component {
  render () {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          this.props.onPress()
        }}
      >
        <Text style={{
          fontWeight: 'bold',
          fontSize: 18,
          color: 'white'
        }}
        >Active Session</Text>
      </TouchableOpacity>
    )
  }
}
