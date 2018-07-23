import React, { Component } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import styles from './styles'

export default class SpcialPostCard extends Component {
  render () {
    return (
      <TouchableOpacity style={styles.card} >
        <Text style={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}>
          {this.props.type}
        </Text>
      </TouchableOpacity>
    )
  }
}
