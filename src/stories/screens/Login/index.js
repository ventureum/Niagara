import * as React from 'react'
import { Image, SafeAreaView } from 'react-native'
import { Button, Text, View } from 'native-base'
import logo from './images/logo.png'
import LinearGradient from 'react-native-linear-gradient'

import styles from './styles'
export interface Props {
  navigation: any;
  pinCode: string;
  walletAddress: string;
}

class Login extends React.Component<Props, State> {
  componentDidMount () {
    if (this.props.pinCode && this.props.walletAddress) {
      this.props.navigation.navigate('PinCode')
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.pinCode && newProps.walletAddress) {
      this.props.navigation.navigate('PinCode')
    }
  }

  render () {
    return (
      <LinearGradient colors={['#090909', '#181724']} style={styles.background}>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode='contain' />
          </View>
          <View style={styles.buttonsContainer}>
            <View padder>
              <Button block onPress={() => this.props.navigation.navigate('CreateWallet')}>
                <Text primaryColor>Create wallet</Text>
              </Button>
            </View>
            <View padder>
              <Button block onPress={() => this.props.navigation.navigate('CreateWallet', {
                recoverMode: true
              })
              }>
                <Text primaryColor>Recover wallet</Text>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    )
  }
}

export default Login
