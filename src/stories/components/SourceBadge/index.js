import React, { Component } from 'react'
import { View, Text } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'

export default class SourceBadge extends Component {
  render () {
    let badgeColor
    this.props.source === 'ON-CHAIN' ? badgeColor = ventureum.secondaryColor : badgeColor = ventureum.darkPrimaryColor
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
