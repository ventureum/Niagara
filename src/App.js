// @flow
import React from 'react'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
import { Root } from 'native-base'
import Login from './container/LoginContainer'
import CreateWallet from './container/CreateWalletContainer'
import RecoverWallet from './container/RecoverWalletContainer'
import Camera from './container/CameraContainer'
import PinCode from './container/PinCodeContainer'
import Home from './container/HomeContainer'
import BlankPage from './container/BlankPageContainer'
import Sidebar from './container/SidebarContainer'

const Drawer = DrawerNavigator(
  {
    Home: { screen: Home }
  },
  {
    initialRouteName: 'Home',
    contentComponent: props => <Sidebar {...props} />
  }
)

const App = StackNavigator(
  {
    Login: { screen: Login },
    CreateWallet: { screen: CreateWallet },
    RecoverWallet: { screen: RecoverWallet },
    Camera: { screen: Camera },
    PinCode: { screen: PinCode },
    BlankPage: { screen: BlankPage },
    Drawer: { screen: Drawer }
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
)

export default () => (
  <Root>
    <App />
  </Root>
)
