import React, { Component } from 'react'
import { View, Text } from 'react-native'

export default class SourceBadge extends Component {
  render () {
    let badgeColor
    this.props.source === 'On-Chain' ? badgeColor = '#9400d3' : badgeColor = '#696969'
    return (
      <View style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: badgeColor,
        borderRadius: 5,
        height: '65%',
        paddingLeft: 5,
        paddingRight: 5
      }}>
        <Text style={{ color: 'white', fontSize: 13 }}>{this.props.source}</Text>
      </View>
    )
  }
}
