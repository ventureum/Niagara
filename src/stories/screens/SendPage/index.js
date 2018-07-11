import React, { Component } from 'react'
import {
  Toast,
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
import wallet from '../../../utils/wallet'

let web3
export default class SendPage extends Component {
  constructor (props) {
    super(props)
    web3 = wallet.getWeb3Instance()
    if (this.props.address) {
      this.state = {
        transactionState: 'normal',
        receiverAddr: null,
        amount: 0,
        balance: this.props.balance,
        address: this.props.address,
        symbol: this.props.symbol,
        decimals: this.props.decimals
      }
    }
  }

  componentDidMount () {
    wallet.getBalance({
      address: this.state.address,
      symbol: this.state.symbol,
      decimals: this.state.decimals
    }).then((balance) => {
      this.setState({ balance })
    })
  }
  sendTx = () => {
    const sender = web3.eth.defaultAccount
    const receiver = this.state.receiverAddr
    const amount = web3.utils.toWei(this.state.amount, 'ether')

    if (this.state.symbol === 'ETH') {
      web3.eth.sendTransaction({
        from: sender,
        to: receiver,
        value: amount,
        gas: 500000
      }).on('transactionHash', (hash) => {
        this.setState({ transactionState: 'pending' })
      }).on('error', (error, rec) => {
        Toast.show({
          text: 'Error in sending transaction!',
          position: 'center',
          buttonText: 'Okay',
          type: 'danger',
          duration: 10000
        })
        this.setState({ transactionState: 'normal' })
      }).on('receipt', (receipt) => {
        this.setState({ transactionState: 'normal' }, () => {
          Toast.show({
            text: 'Transaction is fulfilled!',
            buttonText: 'Okay',
            type: 'success',
            position: 'center',
            duration: 10000
          })
          this.props.navigation.goBack()
        })
      })
    } else {
      // Other ERC20 Token:
      const tokenInstance = wallet.getERC20Instance(this.state.address)
      tokenInstance.methods.transfer(receiver, amount).send({
        from: sender,
        gas: 500000
      }).on('transactionHash', (hash) => {
        this.setState({ transactionState: 'pending' })
      }).on('error', (error) => {
        Toast.show({
          text: 'Error in sending transaction!',
          position: 'center',
          buttonText: 'Okay',
          type: 'danger',
          duration: 10000
        })
        this.setState({ transactionState: 'normal' })
      }).on('receipt', (receipt) => {
        this.setState({ transactionState: 'normal' }, () => {
          Toast.show({
            text: 'Transaction is fulfilled!',
            position: 'center',
            buttonText: 'Okay',
            type: 'success',
            duration: 10000
          })
          this.props.navigation.goBack()
        })
      })
    }
  }

  returnData (data) {
    this.setState({ receiverAddr: data })
  }

  render () {
    let button
    if (this.state.transactionState === 'pending') {
      button = (
        <Button block onPress={this.sendTx}>
          <Spinner />
        </Button>
      )
    } else {
      button = (
        <Button block onPress={this.sendTx}>
          <Text>Send</Text>
        </Button>
      )
    }
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
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
        <Content>
          <Form>
            <Item >
              <Input placeholder="Receiver's Address"
                onChangeText={(text) => this.setState({ receiverAddr: text })}
                value={this.state.receiverAddr}
              />
              <Icon active name='home' />
            </Item>
            <Item>
              <Label>Symbol:</Label>
              <Input disabled value={String(this.state.symbol)} />
            </Item>
            <Item>
              <Label>Balance:</Label>
              <Input disabled value={String(this.state.balance)} />
            </Item>
            <Item >
              <Input placeholder='Amount'
                onChangeText={(text) => this.setState({ amount: text })}
                value={String(this.state.amount)} />
            </Item>
          </Form>
        </Content>
        <Footer>
          <Right>
            {button}
          </Right>
        </Footer>
      </Container>
    )
  }
}
