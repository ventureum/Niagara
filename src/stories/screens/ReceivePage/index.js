import React, { Component } from 'react'
import {Container, Header, Body, Button, Left, Title, Icon, Text} from 'native-base'
import wallet from '../../../utils/wallet'
import QRCode from 'react-native-qrcode-svg'

let web3

export default class ReceivePage extends Component {
  constructor (props) {
    super(props)
    this.state = ({account: '0xE23ABfC1f558Aa08Cfe664af63C3A214D1F95290'})
    web3 = wallet.getWeb3Instance();
    console.log("web3.eth.accounts:", web3.eth.defaultAccount)
    this.state = ({account: web3.eth.defaultAccount})
    console.log("in Receive page:", web3);
    
  }

  render () {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Receive Code</Title>
          </Body>
        </Header>
        <Body style={{padding: 10}}>
          <Text>{this.state.account}</Text>
          <QRCode value={this.state.account}
            size={200}
          />

        </Body>
      </Container>
    )
  }
}
