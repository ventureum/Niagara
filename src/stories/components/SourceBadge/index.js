import React, { Component } from 'react'
import { View, Text } from 'react-native'

export default class SourceBadge extends Component {
  render () {
    let badgeColor
    this.props.source === 'ON-CHAIN' ? badgeColor = '#9400d3' : badgeColor = '#696969'
    return (
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: badgeColor,
        borderRadius: 5,
        height: this.props.height || '40%',
        paddingLeft: 5,
        paddingRight: 5
      }}>
        <Text style={{ color: 'white', fontSize: 12 }}>{this.props.source}</Text>
      </View>
    )
  }
}
