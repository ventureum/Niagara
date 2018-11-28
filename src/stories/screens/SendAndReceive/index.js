import React, { Component } from 'react'
import { Container, Header, Footer, FooterTab, Body, Button, Left, Title, Icon, Text, Content, ListItem, List } from 'native-base'
import styles from './styles.js'
import { BigNumber } from 'bignumber.js'
import { RefreshControl, View, TouchableOpacity } from 'react-native'
import ventureum from '../../../theme/variables/ventureum.js'

let moment = require('moment')

export default class SendAndReceive extends Component {
  format (val) {
    if (BigNumber.isBigNumber(val)) {
      val = new BigNumber(val).toPrecision(3)
    }
    return val
  }

  toSendPage = () => {
    this.props.navigation.navigate('SendPage', {
      tokenIdx: this.props.tokenIdx
    })
  }

  toReceivePage = () => {
    this.props.navigation.navigate('ReceivePage', {
      tokenIdx: this.props.tokenIdx
    })
  }

  onRefresh () {
    this.props.getLogs()
  }

  render () {
    let { token } = this.props
    let listItems
    let listContent
    if (token.eventLogs) {
      listItems = token.eventLogs.map((eventLog, i) => {
        const hashString = String(eventLog.hash)
        let amount = eventLog.value === '0' ? '0'
          : this.format(Number(eventLog.value) / (10 ** 18))
        const date = moment(eventLog.timeStamp * 1000).fromNow()
        if (eventLog.from.toUpperCase() === this.props.address.toUpperCase()) {
          amount = '- ' + amount
        } else {
          amount = '+ ' + amount
        }
        return (
          <ListItem key={i}>
            <Left>
              <Text> {amount} </Text>
            </Left>
            <Body>
              <Text> {date} </Text>
              <Text note> {'tx ' + hashString.slice(0, 7) + '...' + hashString.slice(-6)} </Text>
            </Body>
          </ListItem>)
      })
    }
    if (listItems) {
      listContent = (
        <List>
          {listItems}
        </List>
      )
    }
    return (
      <Container>
        <Header >
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name='arrow-back'style={{ color: ventureum.darkSecondaryColor }} />
            </TouchableOpacity>
          </View>
        </Header>
        <View style={styles.headerInfo}>
          <Title>{token.symbol}</Title>
          <Text>{this.format(token.balance)}</Text>
        </View>
        <Content refreshControl={
          <RefreshControl refreshing={this.props.loading}
            onRefresh={this.onRefresh.bind(this)}
          />} >
          <Text style={styles.listContent}>Transaction logs:</Text>
          {listContent}
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={this.toSendPage} >
              <Icon style={{ color: ventureum.darkSecondaryColor }} name='log-out' />
              <Text style={{ color: ventureum.darkSecondaryColor }}> Send </Text>
            </Button>
            <Button vertical onPress={this.toReceivePage}>
              <Icon style={{ color: ventureum.darkSecondaryColor }} name='log-in' />
              <Text style={{ color: ventureum.darkSecondaryColor }}> Receive </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
