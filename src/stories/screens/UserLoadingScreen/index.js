import React, { Component } from 'react'
import { Container, Text } from 'native-base'
import { View, Image, Platform, ProgressViewIOS, ProgressBarAndroid, Alert } from 'react-native'
import Config from 'react-native-config'
import WalletUtils from '../../../utils/wallet'
import logo from '../Login/images/logo.png'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'
import Axios from 'axios'

export default class UserLoadingScreen extends Component {
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
  }

  checkLogIn = () => {
    var loopId = setInterval(async () => {
      try {
        const { urlKey } = this.props
        const result = await Axios.get(`https://0gbc0znvfh.execute-api.us-west-1.amazonaws.com/alpha?key=${urlKey}`)
        clearInterval(loopId)
        clearTimeout(timeoutId)
        this.props.registerUser(result.data.body.id, result.data.body.username, result.data.body.id)
        this.generateWallet()
      } catch (error) {
      }
    }, 1000)
    var timeoutId = setTimeout(() => {
      clearInterval(loopId)
      Alert.alert(
        'Ooops',
        'Log in with Telegram timeout.',
        [
          {
            text: 'OK',
            onPress: () => {
            },
            style: 'cancel'
          }
        ],
        { cancelable: false }
      )
      this.props.navigation.goBack()
    }, 15000)
  }

  componentWillMount () {
    this.checkLogIn()
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
    if (nextProps.userLoaded) {
      this.props.navigation.navigate('Main')
      return false
    }
    return true
  }

  render () {
    return (
      <Container>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode='contain' />
            <Text style={styles.appName}>Milestone</Text>
          </View>
          {Platform.OS === 'ios'
            ? <ProgressViewIOS style={{ alignSelf: 'stretch' }} progressViewStyle='bar' progressTintColor={ventureum.lightSecondaryColor} />
            : <ProgressBarAndroid style={{ alignSelf: 'stretch' }} styleAttr='Horizontal' color={ventureum.lightSecondaryColor} />
          }
          <Text style={{
            color: ventureum.subTextOnPrimary,
            fontSize: ventureum.componentTitleFontSizeBig,
            alignSelf: 'center',
            marginTop: ventureum.basicPadding * 2
          }}>
            Preparing your account...
          </Text>
        </View>
      </Container >
    )
  }
}
