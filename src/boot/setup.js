import '../../global'
import * as React from 'react'
import { StyleProvider, Text, Root } from 'native-base'
import { Provider } from 'react-redux'
import {
  View,
  SafeAreaView,
  Image,
  Platform,
  ProgressViewIOS,
  ProgressBarAndroid,
  AppState
} from 'react-native'
import { persistor, configureStore, store } from './configureStore'
import App from '../App'
import getTheme from '../theme/components'
import variables from '../theme/variables/platform'
import WalletUtils from '../utils/wallet.js'
import { PersistGate } from 'redux-persist/integration/react'
import styles from './styles'
import logo from '../stories/screens/Login/images/logo.png'
import ventureum from '../theme/variables/ventureum'

export interface Props { }
export interface State {
  store: Object;
  isLoading: boolean;
}
export default class Setup extends React.Component<Props, State> {
  constructor () {
    super()
    configureStore(() => {
      this.setState({ isLoading: false })
    })

    WalletUtils.loadTokens()
  }

  renderLoading = () => {
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
            {
              (Platform.OS === 'ios'
                ? <ProgressViewIOS style={{ alignSelf: 'stretch' }} progressViewStyle='bar' progressTintColor={ventureum.lightSecondaryColor} />
                : <ProgressBarAndroid style={{ alignSelf: 'stretch' }} styleAttr='Horizontal' color={ventureum.lightSecondaryColor} />
              )
            }
            <Text style={{
              color: ventureum.subTextOnPrimary,
              fontSize: ventureum.componentTitleFontSizeBig,
              alignSelf: 'center',
              marginTop: ventureum.basicPadding * 2
            }}>
              Loading...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    )
  }

  render () {
    return (
      <StyleProvider style={getTheme(variables)}>
        <Provider store={store}>
          <PersistGate loading={this.renderLoading()} persistor={persistor}>
            <Root>
              <App />
            </Root>
          </PersistGate>
        </Provider>
      </StyleProvider >
    )
  }
}
