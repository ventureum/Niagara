import React, { Component } from 'react'
import { View, Text, Picker, Button, TextInput } from 'react-native'
import styles from './styles'
import { Icon } from 'native-base'
import { BigNumber } from 'bignumber.js'
let moment = require('moment')
const BASE_18 = (new BigNumber(10)).pow(18)

export default class MilestoneCard extends Component {
  state = {
    action: 'Purchase',
    amount: '',
    cost: new BigNumber(0),
    fee: new BigNumber(0),
    userOptionBalance: (new BigNumber(this.props.milestoneData.userOptionBalance))
      .div(new BigNumber(10).pow(this.props.milestoneData.tokenDecimals))

  }

  estimateFee = (amount) => {
    const baseDecimal = new BigNumber(10).pow(this.props.milestoneData.tokenDecimals)
    const numToken = (new BigNumber(amount)).times(baseDecimal)
    if (this.props.milestoneData.putOptionFeeRateGtOne) {
      return numToken.times(new BigNumber(this.props.milestoneData.putOptionFeeRate)).div(BASE_18)
    }
    return numToken.div(new BigNumber(this.props.milestoneData.putOptionFeeRate)).div(BASE_18)
  }

  estimateCost = (amount) => {
    const base18 = (new BigNumber(10)).pow(18)
    const baseDecimal = new BigNumber(10).pow(this.props.milestoneData.tokenDecimals)

    const numToken = (new BigNumber(amount)).times(baseDecimal)
    const cost = numToken.div(new BigNumber(this.props.milestoneData.milestonePrices)).div(base18)
    return cost
  }

  onSubmit = (postHash, amount, fee, action) => {
    const baseDecimal = new BigNumber(10).pow(this.props.milestoneData.tokenDecimals)
    const numToken = (new BigNumber(amount)).times(baseDecimal)
    const numVtxFeeToken = fee.times(BASE_18)
    this.props.processPutOption(postHash, numToken, numVtxFeeToken, action)
  }

  render () {
    const {
      milestoneEndTime,
      tokenSymbol
    } = this.props.milestoneData

    return (
      <View style={styles.shadow}>
        <View style={styles.cardContainer} >
          <View style={styles.header} >
            <View style={styles.headerLeft}>
              <Icon name='home' />
              <View style={styles.headerLeftTextContainer}>
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: 12,
                  color: '#474646'
                }}>Put-option</Text>
                <Text style={{
                  fontSize: 10,
                  color: '#878787'
                }}>
                  Expired on {moment.unix(milestoneEndTime).format('MMMM Do YYYY, hh:mm:ss')}
                </Text>
              </View>
            </View>

            <Picker
              selectedValue={this.state.action}
              style={{ height: 40, width: 120 }}
              onValueChange={(itemValue, itemIndex) => this.setState({ action: itemValue })}>
              <Picker.Item label='Purchase' value='Purchase' />
              <Picker.Item label='Exercise' value='exercise' />
            </Picker>
          </View>
          <View style={styles.optionContainer}>
            <Text style={{
              fontWeight: '500',
              fontSize: 16,
              color: '#9822ae'
            }}>My options</Text>
            <Text style={{
              fontSize: 14,
              color: '#9822ae',
              fontWeight: '500'
            }}>{this.state.userOptionBalance.toString()} {tokenSymbol}</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.textInput}>
                <TextInput
                  placeholder='Amount'
                  keyboardType='numeric'
                  value={this.state.amount}
                  onChangeText={(amount) => {
                    const cost = this.estimateCost(amount)
                    const fee = this.estimateFee(amount)
                    this.setState({
                      amount: amount,
                      cost: cost,
                      fee: fee
                    })
                  }}
                  selectionColor='#9822ae'
                  underlineColorAndroid='#9822ae'
                />
              </View>
              <Text style={{
                fontWeight: '100',
                fontSize: 16,
                color: '#474646'
              }}>{tokenSymbol}</Text>
            </View>

            <Text style={{
              fontWeight: '400',
              fontSize: 12,
              color: '#878787'
            }}> Approximately costs {this.state.cost.toString()} Ether</Text>
            <Text style={{
              fontWeight: '400',
              fontSize: 12,
              color: '#878787'
            }}> Fee: {this.state.fee.toString()} VTX</Text>
          </View>
          <View style={styles.footer}>
            <Button
              title='Submit'
              color='#9822ae'
              onPress={() => {
                this.onSubmit(this.props.postHash, this.state.amount, this.state.fee, this.state.action)
              }}
            />
          </View>
        </View>
      </View>
    )
  }
}
