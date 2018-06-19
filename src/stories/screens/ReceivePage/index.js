import React, { Component } from 'react'
import {Container, Header, Body, Button, Left, Title, Icon, Text} from 'native-base'
import wallet from '../../../utils/wallet'
import QRCode from 'react-native-qrcode-svg'

let web3

export default class ReceivePage extends Component {
  constructor (props) {
    super(props)
    web3 = wallet.getWeb3Instance();
    this.state = ({account: web3.eth.defaultAccount})
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
