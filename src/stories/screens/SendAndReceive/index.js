import React, { Component } from 'react'
import {Container, Header, Footer, FooterTab, Body, Button, Left, Right, Title, Icon, Text, Content} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import styles from './styles.js'
var numeral = require('numeral')
import { BigNumber } from 'bignumber.js'

export default class SendAndReceive extends Component {

  format(val) {
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
      tokenIdx: this.props.tokenIdx,
    })
  }

  toReceivePage = () => {
    this.props.navigation.navigate('ReceivePage', {
      tokenIdx: this.props.tokenIdx,
    })
  }

  render () {
    let { token, loading } = this.props

    return (
      <Container style={styles.container}>
        <Header span>
          <Grid>
            <Row size={1}>
            </Row>
            <Row size={2}>
              <Body style = {{flexDirection: "row", justifyContent: "center"}}>
                <Title style={styles.textContent}> { token.symbol } </Title>
              </Body>
            </Row>
            <Row size={1}>
              <Body style = {{flexDirection: "row", justifyContent: "center"}}>
                <Text style={styles.textContent}> { this.format(token.balance) } </Text>
              </Body>
            </Row>
          </Grid>
        </Header>
        <Content>
          <Body>
            <Left>
              <Text> Transaction log </Text>
            </Left>
          </Body>
        </Content>
        <Footer>
          <FooterTab>
            <Button vertical onPress={ this.toSendPage } >
              <Icon name="log-out" />
              <Text> Send </Text>
            </Button>
            <Button vertical onPress={ this.toReceivePage }>
              <Icon name="log-in" />
              <Text> Receive </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}
