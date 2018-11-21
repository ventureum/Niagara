import * as React from 'react'
import {
  Image,
  SafeAreaView,
  Linking,
  Platform
} from 'react-native'
import { Button, Text, View } from 'native-base'
import logo from './images/logo.png'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'

class Login extends React.Component {
  renderLoginOptions = () => {
    return (
      <View padder>
        <Button block onPress={
          () => {
            var nanoid = require('nanoid/non-secure')
            let urlKey = 'key'
            urlKey = nanoid(24)
            const source = Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
            const payload = `${urlKey}_${source}`
            const url = 'https://telegram.me/Milestone_Auth_bot?start=' + payload
            Linking.canOpenURL(url).then(supported => {
              if (supported) {
                Linking.openURL(url)
              } else {
                console.log("Don't know how to open URI: " + url)
              }
            })
          }}>
          <Text
            style={{
              fontWeight: ventureum.bold
            }}
            primaryColor>
           LOG IN WITH TELEGRAM
          </Text>
        </Button>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.background}>
        <SafeAreaView style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} resizeMode='contain' />
            <View padder>
              <Text style={styles.appName}>Milestone</Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            {this.renderLoginOptions()}
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

export default Login
