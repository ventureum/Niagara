import React, { Component } from 'react'
import { Container, Header, Body, Button, Left, Title, Icon, Text, Right } from 'native-base'
import { View } from 'react-native'
import wallet from '../../../utils/wallet'
import QRCode from 'react-native-qrcode-svg'
import styles from './styles'
import venturem from '../../../theme/variables/ventureum'

let web3

export default class ReceivePage extends Component {
  constructor(props) {
    super(props)
    web3 = wallet.getWeb3Instance()
    this.state = ({ account: web3.eth.defaultAccount })
  }

  render() {
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
          <Right />
        </Header>
        <View style={styles.container}>
          <View style={styles.qrContainer}>
            <QRCode value={this.state.account}
              size={200}
            />
            <Text
              style={{
                fontSize: venturem.paragraphFontSize - 1,
                fontWeight: venturem.normal,
                paddingTop: venturem.basicPadding * 2
              }}
            >{this.state.account}</Text>
          </View>
        </View>
      </Container>
    )
  }
}
