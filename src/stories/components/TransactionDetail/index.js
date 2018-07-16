import React, { Component } from 'react'
import { View, Text } from 'react-native'

export default class TransactionDetail extends Component {
  sliceHash = (hash) => {
    return hash.slice(0, 7) + '...' + hash.slice(-5)
  }
  render () {
    return (
      <View style={{
        flexDirection: 'column'
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>To</Text>
          <Text>{this.sliceHash(this.props.receipt.to)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>Block Number</Text>
          <Text>{this.props.receipt.blockNumber}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>Block Hash</Text>
          <Text>{this.sliceHash(this.props.receipt.blockHash)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>Gas Used</Text>
          <Text>{this.props.receipt.cumulativeGasUsed}</Text>
        </View>
      </View>
    )
  }
}
