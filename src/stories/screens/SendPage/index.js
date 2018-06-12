import React, { Component } from 'react'
import {Toast, Container, Header, Form, Icon, Spinner, Title,
  Item, Label, Input, Content, Text, Button, Left, Right, Body, Footer } from 'native-base'
import wallet from '../../../utils/wallet'

let accounts
let web3
export default class SendPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      transactionState: 'normal',
      receiverAddr: null,
      amount: null
    }
    
    web3 = wallet.getWeb3Instance();
    
  }

  componentWillMount () {

    web3.eth.getAccounts().then((value) => {
      accounts = value
      console.log(accounts)
    })
  }

    sendEther = () => {
      const sender = accounts[0]
      const receiver = this.state.receiverAddr
      const amount = web3.utils.toWei(this.state.amount, 'ether')

      console.log('sender', sender)
      console.log('receiver', receiver)
      console.log('amount', amount)
      web3.eth.sendTransaction(
        {from: sender, to: receiver, value: amount}
      ).on('transactionHash', (hash) => {
        console.log('Hash:', hash)
        this.setState({transactionState: 'pending'})
      }
      ).on('error', (error) => {
        Toast.show({
          text: 'Error in sending transaction!',
          position: 'center',
          buttonText: 'Okay',
          type: 'danger',
          duration: 10000
        })
      }
      ).on('receipt', (receipt) => {
        console.log('receipt:', receipt)
        this.setState({transactionState: 'normal'}, () => {
          Toast.show({
            text: 'Transaction is fulfilled!',
            buttonText: 'Okay',
            type: 'success',
            duration: 10000
          })
        })
      }
      )
    }

    returnData (data) {
      this.setState({receiverAddr: data})
    }

    renderButton () {
      if (this.state.transactionState == 'pending') {
        return (
          <Button>
            <Spinner />
          </Button>
        )
      } else {
        return (
          <Button block onPress={this.sendEther}>
            <Text>Send</Text>
          </Button>
        )
      }
    }

    render () {
      let button
      if (this.state.transactionState == 'pending') {
        button = (
          <Button block onPress={this.sendEther}>
            <Spinner />
          </Button>
        )
      } else {
        button = (
          <Button block onPress={this.sendEther}>
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
                onPress={() => this.props.navigation.navigate('QRScaner', {returnData: this.returnData.bind(this)})}
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
              <Item last>
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
