import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { Thumbnail, Input, Item, Icon } from 'native-base'
import styles from './styles'
import { BigNumber } from 'bignumber.js'

const DECIMAL_FIXED = 5
export default class RefuelReputation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      reputation: '',
      cost: new BigNumber(0)
    }
  }

  calculateCost = (reputation) => {
    if (reputation !== '') {
      const value = new BigNumber(reputation)
      const rate = new BigNumber(0.0351111111123123)
      return value.times(rate)
    }
    return new BigNumber(0)
  }

  checkInput = (reputation) => {
    if (Number.isInteger(Number(reputation))) {
      return true
    } else {
      Alert.alert(
        'Invalid Input',
        'Integer Only!',
        [
          { text: 'Ok', onPress: () => { } }
        ],
        { cancelable: false }
      )
    }
    return false
  }

  render () {
    return (
      <View style={styles.background}>
        <View style={styles.purchaseContainer}>
          <View style={styles.nameCard}>
            <Thumbnail circle large source={{ uri: this.props.avatar }} />
            <Text style={{ padding: 10 }}>Reputation: {this.props.reputation}</Text>
          </View>
          <View style={styles.textContainer} >
            <Text>Amount of reputations to be purchased</Text>
          </View>
          <Item>
            <Icon active name='ios-people' />
            <Input
              placeholder='Amount'
              keyboardType='numeric'
              autoFocus
              value={this.state.reputation}
              onChangeText={(reputation) => {
                if (this.checkInput(reputation)) {
                  const cost = this.calculateCost(reputation)
                  this.setState({
                    reputation: reputation,
                    cost: cost
                  })
                }
              }}
            />
          </Item>
          <View style={styles.textContainer} >
            <Text>Cost: {this.state.cost.toFixed(DECIMAL_FIXED).toString()} VTX</Text>
          </View>
          <TouchableOpacity
            style={styles.transferButton}
            onPress={() => {
              this.props.refuelReputation(parseInt(this.state.reputation), this.props.refreshProfile)
              this.props.navigation.goBack()
            }}
          >
            <Text style={{ color: 'white' }}>Purchase</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
