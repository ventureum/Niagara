import Config from 'react-native-config'
import * as React from 'react'
import { Alert, SafeAreaView } from 'react-native'
import { Header, Body, Title, Button, Text, View, Icon, Left, Right, Container } from 'native-base'
import PinKeyboard from '../../components/PinKeyboard'
import PinIndicator from '../../components/PinIndicator'
import LinearGradient from 'react-native-linear-gradient'
import WalletUtils from '../../../utils/wallet'

import styles from './styles'
export interface Props {
  navigation: any;
}

class CreateWallet extends React.Component<Props, State> {
  state = {
    confirmationPinCode: '',
    pinCode: '',
    isConfirmation: false,
    wallet: null
  };

  onBackPress = () => {
    if (!this.state.isConfirmation) {
      this.setState({
        pinCode: this.state.pinCode.slice(0, -1)
      })
    } else {
      this.setState({
        confirmationPinCode: this.state.confirmationPinCode.slice(0, -1)
      })
    }
  };

  onKeyPress = n => {
    if (!this.state.isConfirmation) {
      this.updatePinCode(n)
    } else {
      this.updateConfirmationPinCode(n)
    }
  };

  updatePinCode = n => {
    this.setState(
      {
        pinCode: `${this.state.pinCode}${n}`
      },
      () => {
        if (this.state.pinCode.length === 4) {
          this.setState({
            isConfirmation: true
          })
        }
      }
    )
  };

  updateConfirmationPinCode = n => {
    this.setState(
      {
        confirmationPinCode: `${this.state.confirmationPinCode}${n}`
      },
      async () => {
        if (
          this.state.confirmationPinCode.length === 4 &&
          this.state.pinCode === this.state.confirmationPinCode
        ) {
          this.props.setPinCode(this.state.pinCode)

          if (this.props.navigation.getParam('recoverMode', false)) {
            this.props.navigation.navigate('RecoverWallet')
            return
          } else if (
            !this.props.navigation.getParam('editMode', false) &&
            !this.props.navigation.getParam('migrationMode', false)
          ) {
            this.generateWallet()
          }

          setTimeout(() => {
            Alert.alert(
              'Success',
              'Wallet created! Address: ' + this.state.wallet.address
            )
            this.props.navigation.navigate('Home')
          })
        } else if (this.state.confirmationPinCode.length === 4) {
          this.setState(
            {
              pinCode: '',
              confirmationPinCode: '',
              isConfirmation: false
            },
            () => {
              Alert.alert(
                'PIN Code',
                "Your PIN code doesn't match. Please try again."
              )
            }
          )
        }
      }
    )
  };

  generateWallet () {
    let privateKey = Config.ACCOUNT_PRIVATE_KEY
    if (privateKey === '0x') {
      var crypto = require('crypto')
      privateKey = '0x' + crypto.randomBytes(32).toString('hex')
    }
    const Web3 = require('web3')
    const web3 = new Web3(WalletUtils.getWeb3HTTPProvider())
    const wallet = web3.eth.accounts.privateKeyToAccount(privateKey)
    this.props.setWalletAddress(wallet.address)
    this.props.setPrivateKey(wallet.privateKey)
    this.setState({
      wallet
    })
  }

  render () {
    const pinCode = this.state.isConfirmation
      ? this.state.confirmationPinCode
      : this.state.pinCode

    const originalTitle = this.props.navigation.getParam('editMode', false)
      ? 'Change PIN'
      : 'Create PIN'

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                active
                name='arrow-back'
                onPress={() => this.props.navigation.goBack()}
              />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.isConfirmation ? 'Repeat PIN' : originalTitle}</Title>
          </Body>
          <Right />
        </Header>
        <SafeAreaView style={styles.container}>
          <View style={styles.explanatoryTextContainer}>
            <Text style={styles.explanatoryText}>
              {this.state.isConfirmation
                ? "Just to make sure it's correct"
                : "This PIN will be used to access your wallet. If you forget it, you won't be able to access your wallet."}
            </Text>
          </View>

          <PinIndicator length={pinCode.length} />
          <PinKeyboard
            onBackPress={this.onBackPress}
            onKeyPress={this.onKeyPress}
            showBackButton={pinCode.length > 0}
          />
        </SafeAreaView>
      </Container>
    )
  }
}

export default CreateWallet
