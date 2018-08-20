import React, { Component } from 'react'
import {
  Container,
  Header,
  Form,
  Icon,
  Spinner,
  Title,
  Item,
  Label,
  Input,
  Content,
  Text,
  Button,
  Left,
  Right,
  Body,
  Footer
} from 'native-base'

export default class SendPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      receiverAddr: null,
      amount: 0
    }
  }

  sendTx = async (receiverAddr, tokenSymbol, tokenAddr, amount) => {
    if (this.state.amount !== 0) {
      if (tokenSymbol === 'ETH') {
        // ether
        this.props.sendTransaction(receiverAddr, tokenSymbol, null, amount)
      } else {
        // other ERC20 tokens
        this.props.sendTransaction(receiverAddr, tokenSymbol, tokenAddr, amount)
      }
    }
    this.setState({ amount: 0 })
    this.props.navigation.goBack()
  }

  returnData (data) {
    this.setState({ receiverAddr: data })
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
            <Title>Send</Title>
          </Body>
          <Right>
            <Button transparent
              onPress={
                () => this.props.navigation.navigate('QRScaner', { returnData: this.returnData.bind(this) })
              }
            >
              <Icon name='md-qr-scanner' />
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item >
              <Input
                placeholder="Receiver's Address"
                onChangeText={(text) => this.setState({ receiverAddr: text })}
                value={this.state.receiverAddr}
              />
              <Icon active name='home' />
            </Item>
            <Item>
              <Label>Symbol:</Label>
              <Input disabled value={String(this.props.tokenSymbol)} />
            </Item>
            <Item>
              <Label>Balance:</Label>
              <Input disabled value={String(this.props.tokenBalance)} />
            </Item>
            <Item >
              <Input
                placeholder='Amount'
                keyboardType='numeric'
                onChangeText={(text) => this.setState({ amount: text })}
                value={String(this.state.amount)} />
            </Item>
          </Form>
        </Content>
        <Footer>
          <Right>
            {this.props.loading
              ? <Button block>
                <Spinner />
              </Button>
              : <Button block onPress={() => {
                this.sendTx(this.state.receiverAddr, this.props.tokenSymbol, this.props.tokenAddress, this.state.amount)
              }}>
                <Text>Send</Text>
              </Button>
            }
          </Right>
        </Footer>
      </Container>
    )
  }
}
