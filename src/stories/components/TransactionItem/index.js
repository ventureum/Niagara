import React, { Component } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Icon } from 'native-base'
import styles from './styles'
import TransactionDetail from '../TransactionDetail'

let moment = require('moment')

export default class TransactionItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      expended: false
    }
  }
  render () {
    let { hash, status, timestamp } = this.props.transaction
    hash = hash.slice(0, 7) + '...' + hash.slice(-5)
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          this.setState({ expanded: !this.state.expanded })
        }}
      >
        <View style={styles.transactionContainer} >
          <View style={styles.hashContainer}>
            <Icon active name='list' />
            <Text style={styles.hashText}>{hash}</Text>
          </View>
          <Text
            style={status === 'Pending' ? styles.pendingText : styles.fulfilledText}
          >
            {status}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={{ fontSize: 12, color: '#aaa' }}>
            {moment(timestamp * 1000).fromNow()}
          </Text>
        </View>
        {(status === 'Fulfilled' && this.state.expanded)
          ? <TransactionDetail receipt={this.props.transaction.receipt} />
          : <View />
        }
      </TouchableOpacity>
    )
  }
}
