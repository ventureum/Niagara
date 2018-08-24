import React, { Component } from 'react'
import { View, Text, Picker, Button, TextInput, Alert } from 'react-native'
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
    submitAble: true
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

  onSubmit = (postHash, amount, milestoneTokenAddress, fee, action) => {
    const baseDecimal = new BigNumber(10).pow(this.props.milestoneData.tokenDecimals)
    const numToken = (new BigNumber(amount)).times(baseDecimal)
    const numVtxFeeToken = fee.times(BASE_18)
    const {tokenSymbol} = this.props.milestoneData
    Alert.alert(
      'Purchase Put-option',
      `Please confirm the following information:\n\nPurchasing ${amount} ${tokenSymbol}\nCost: ${this.state.cost} Ether\nFees: ${fee} VTX`,
      [
        {
          text: 'Cancel',
          onPress: () => {
          },
          style: 'cancel'
        },
        { text: 'Confirm',
          onPress: () => {
            this.props.submitPutOption(postHash, numToken, milestoneTokenAddress, numVtxFeeToken, action)
          }
        }
      ],
      { cancelable: false }
    )
  }

  render () {
    const {
      milestoneEndTime,
      tokenSymbol,
      userOptionBalance,
      tokenDecimals,
      milestoneTokenAddress
    } = this.props.milestoneData
    let readableOptionBalance = (new BigNumber(userOptionBalance))
      .div(new BigNumber(10).pow(tokenDecimals))
    return (
      <View style={styles.shadow}>
        <View style={styles.cardContainer}>
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
            }}>{readableOptionBalance.toString()} {tokenSymbol}</Text>
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
              disabled={this.props.milestoneDataLoading}
              onPress={() => {
                this.onSubmit(this.props.postHash, this.state.amount, milestoneTokenAddress, this.state.fee, this.state.action)
              }}
            />
          </View>
        </View>
      </View >
    )
  }
}
