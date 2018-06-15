import React, { Component } from 'react'
import {Toast, Container, Header, Form, Icon, Spinner, Title,
  Item, Label, Input, Content, Text, Button, Left, Right, Body, Footer, Textarea } from 'native-base'
import wallet from '../../../utils/wallet'

let web3
export default class SendPage extends Component {
  constructor (props) {
    super(props)
    web3 = wallet.getWeb3Instance()
    if (this.props.navigation.getParam('symbol')){
      this.state = {
        transactionState: 'normal',
        receiverAddr: null,
        amount: null,
        balance: "0",
        contractAddress: this.props.navigation.getParam('contractAddress'),
        symbol: this.props.navigation.getParam('symbol'),
        decimals: this.props.navigation.getParam('decimals'),
        previousTx: null
      } 
    }
    else {
      this.state = {
        transactionState: 'normal',
        receiverAddr: null,
        amount: null,
        balance: "0",
        contractAddress: null,
        symbol: "ETH",
        decimals: 18,
        previousTx: null
      } 
    }
  }

  componentDidMount () {
    wallet.getBalance({
      contractAddress: this.state.contractAddress,
      symbol: this.state.symbol,
      decimals: this.state.decimals
    }).then((balance) => {
      this.setState({balance})
    })
  }
    sendTx = () => {
      const sender = web3.eth.defaultAccount
      const receiver = this.state.receiverAddr
      const amount = web3.utils.toWei(this.state.amount, 'ether')

      console.log('sender', sender)
      console.log('receiver', receiver)
      console.log('amount', amount)

      if (this.state.symbol === 'ETH') {
        web3.eth.sendTransaction({
          from: sender, 
          to: receiver, 
          value: amount, 
          gas: 500000
        }).on('transactionHash', (hash) => {
          console.log('Hash:', hash)
          this.setState({transactionState: 'pending'})
        }).on('error', (error) => {
          Toast.show({
            text: 'Error in sending transaction!',
            position: 'center',
            buttonText: 'Okay',
            type: 'danger',
            duration: 10000
          })
        }).on('receipt', (receipt) => {
          console.log('receipt:', receipt)
          this.setState({transactionState: 'normal'}, () => {
            Toast.show({
              text: 'Transaction is fulfilled!',
              buttonText: 'Okay',
              type: 'success',
              duration: 10000
            })            
            this.setState({previousTx: receipt})
          })
        })
      }
      else {
        // Other ERC20 Token:
        const tokenInstance = wallet.getERC20Instance(this.state.contractAddress);

        tokenInstance.methods.transfer(receiver, amount).send({
          from: sender,
          gas: 500000
        }).on('transactionHash', (hash) => {
          console.log('Hash:', hash)
          this.setState({transactionState: 'pending'})
        }).on('error', (error) => {
          Toast.show({
            text: 'Error in sending transaction!',
            position: 'center',
            buttonText: 'Okay',
            type: 'danger',
            duration: 10000
          })
        }).on('receipt', (receipt) => {
          console.log('receipt:', receipt)
          this.setState({transactionState: 'normal'}, () => {
            Toast.show({
              text: 'Transaction is fulfilled!',
              buttonText: 'Okay',
              type: 'success',
              duration: 10000
            })
            this.setState({previousTx: receipt})
          })
        })
      }
    }

    returnData (data) {
      this.setState({receiverAddr: data})
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
      // let tx
      // if (this.state.previousTx != null){
      //   tx = (              
      //     <Item>
      //           <Label>Tx Hash:</Label>
      //           <Input disabled value={
      //             "Tx Hash:\n" + 
      //             this.state.previousTx.transactionHash +
      //             this.state.previousTx.from

      //           }/>
      //     </Item>
      //   )
      // }
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
                  () => this.props.navigation.navigate('QRScaner', {returnData: this.returnData.bind(this)})}
              >
                <Icon name='menu' />
              </Button>
            </Right>
          </Header>
          <Content>
            <Form>
              <Item >
                <Input placeholder="Receiver's Address"
                  onChangeText={(text) => this.setState({receiverAddr: text})}
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
                  onChangeText={(text) => this.setState({amount: text})}
                  value={this.state.amount} />
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
