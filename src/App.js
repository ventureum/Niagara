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
import SendPage from './container/SendPageContainer'
import ReceivePage from './container/ReceivePageContainer'
import QRScaner from './container/QRScanerContainer'
import Assets from './container/AssetsContainer'
import SendAndReceive from './container/SendAndReceiveContainer'
import Discover from './container/DiscoverContainer'
import Reply from './container/ReplyContainer'

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
    Drawer: { screen: Drawer },
    SendPage: { screen: SendPage },
    ReceivePage: { screen: ReceivePage },
    QRScaner: { screen: QRScaner },
    Assets: { screen: Assets },
    SendAndReceive: { screen: SendAndReceive },
    Discover: { screen: Discover },
    Reply: { screen: Reply }
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
