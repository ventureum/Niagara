import React, { Component } from 'react'
import { Container, Text } from 'native-base'
import { View, Image, Platform, ProgressViewIOS, ProgressBarAndroid, Alert } from 'react-native'
import Config from 'react-native-config'
import logo from '../Login/images/logo.png'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'
const jwt = require('jsonwebtoken')

export default class UserLoadingScreen extends Component {
  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.props.userLoaded && this.props.accessToken !== {}) {
      this.props.navigation.navigate('Main')
    }
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
      this.props.setAccessToken({ jwt: token, exp: verifiedToken.exp })
      this.props.loginUser(actor, username, telegramId)
    } catch (e) {
      console.log(e)
      throw new Error('Access token verification failed/expired.')
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
