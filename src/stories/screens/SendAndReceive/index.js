import React, { Component } from 'react'
import {Container, Header, Footer, FooterTab, Body, Button, Left, Right, Title, Icon, Text, Content, ListItem, List} from 'native-base'
import { Grid, Row } from 'react-native-easy-grid'
import styles from './styles.js'
import { BigNumber } from 'bignumber.js'

var numeral = require('numeral')

export default class SendAndReceive extends Component {
  format (val) {
    if (BigNumber.isBigNumber(val)) {
      val = val.toNumber()
    }
    if (val > 1000) {
      return numeral(val.toString()).format('0.0 a')
    } else {
      return numeral(val.toString()).format('0.000')
    }
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

  render () {
    let { token } = this.props
    let listItems
    let listContent
    if (token.logs){
      listItems = token.logs.map((log, i) => {
        return (
          <ListItem key={i}>
            <Left>
              <Text> {log.transactionHash} </Text>
            </Left>
          </ListItem>)
      })
    }
    if (listItems){
      listContent = (
        <List>          
          {listItems}
        </List>
      )
    }

    return (
      <Container style={styles.container}>
        <Header span>
          <Grid>
            <Row size={1} />
            <Row size={2}>
              <Body style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Title style={styles.textContent}> { token.symbol } </Title>
              </Body>
            </Row>
            <Row size={1}>
              <Body style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={styles.textContent}> { this.format(token.balance) } </Text>
              </Body>
            </Row>
          </Grid>
        </Header>
        <Content>
        <Text style={styles.listContent}> Transaction logs:</Text>
        {listContent}
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={this.toSendPage} >
              <Icon name='log-out' />
              <Text> Send </Text>
            </Button>
            <Button vertical onPress={this.toReceivePage}>
              <Icon name='log-in' />
              <Text> Receive </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
