import React, { Component } from 'react'
import { Container, Text } from 'native-base'
import { View, Image, Platform, ProgressViewIOS, ProgressBarAndroid, Alert } from 'react-native'
import Config from 'react-native-config'
import WalletUtils from '../../../utils/wallet'
import logo from '../Login/images/logo.png'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'
const jwt = require('jsonwebtoken')

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

  componentWillReceiveProps (nextProps) {
    if (nextProps.userLoaded) {
      this.props.navigation.navigate('Main')
      return false
    }
    return true
  }

  receivedJWT = async () => {
    const token = this.props.navigation.getParam('token', null)
    if (token === null) {
      Alert.alert(
        'Ooops',
        'Log in with Telegram failed.',
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
    }
    const JWTRS256_PUBLIC = `-----BEGIN PUBLIC KEY-----\n${Config.JWTRS256_PUBLIC}\n-----END PUBLIC KEY-----`
    try {
      const verifiedToken = await jwt.verify(token, JWTRS256_PUBLIC, { algorithms: ['RS256'] })
      const { actor, username, telegramId } = verifiedToken.data
      this.props.registerUser(actor, username, telegramId, token)
      this.generateWallet()
    } catch (e) {
      throw new Error('Access token verification failed.')
    }
  }

  componentDidMount () {
    this.receivedJWT()
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
            ? <ProgressViewIOS
              style={{ alignSelf: 'stretch' }}
              progressViewStyle='bar'
              progressTintColor={ventureum.lightSecondaryColor}

            />
            : <ProgressBarAndroid
              style={{ alignSelf: 'stretch' }} s
              styleAttr='Horizontal'
              color={ventureum.lightSecondaryColor}
            />
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
