import React from 'react'
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator
} from 'react-navigation'
import { Root } from 'native-base'
import LoginPage from './container/LoginContainer'
import SendPage from './container/SendPageContainer'
import ReceivePage from './container/ReceivePageContainer'
import QRScaner from './container/QRScanerContainer'
import AssetsContainer from './container/AssetsContainer'
import SendAndReceive from './container/SendAndReceiveContainer'
import DiscoverContainer from './container/DiscoverContainer'
import Reply from './container/ReplyContainer'
import ProfileContainer from './container/ProfileContainer'
import Transaction from './container/TransactionContainer'
import SearchPage from './stories/screens/SearchPage'
import TokenToggle from './container/TokenToggleContainer'
import NewPost from './container/NewPostContainer'
import PostDetail from './container/PostDetailContainer'
import Refuel from './container/RefuelContainer'
import ChatPage from './container/ChatPageContainer'
import TransferPage from './container/TransferPageContainer'
import ActivityPage from './container/ActivityPageContainer'
import TabBarComponent from './stories/components/TabBarComponent'
import TCRContainer from './container/TCRContainer'
import AppLoadingScreen from './container/AppLoadingScreen'
import UserLoadingScreen from './container/UserLoadingContainer'
import HomeContainer from './container/HomeContainer'
import BoardDetail from './container/BoardDetailContainer'

const Login = createStackNavigator(
  {
    LoginPage: { screen: LoginPage },
    UserLoadingScreen: {
      screen: UserLoadingScreen,
      path: 'loading/:token'
    }
  },
  {
    initialRouteName: 'LoginPage',
    headerMode: 'none'
  }
)

const HomeTabNavigator = createBottomTabNavigator(
  {
    Home: { screen: HomeContainer },
    Discover: { screen: DiscoverContainer },
    TCR: { screen: TCRContainer },
    Profile: { screen: ProfileContainer }
  },
  {
    tabBarComponent: TabBarComponent,
    initialRouteName: 'Home'
  }
)

const MainNavigator = createStackNavigator(
  {
    HomeTab: { screen: HomeTabNavigator },
    Reply: { screen: Reply },
    NewPost: { screen: NewPost },
    PostDetail: { screen: PostDetail },
    SendPage: { screen: SendPage },
    ReceivePage: { screen: ReceivePage },
    SearchPage: { screen: SearchPage },
    TokenToggle: { screen: TokenToggle },
    QRScaner: { screen: QRScaner },
    SendAndReceive: { screen: SendAndReceive },
    ChatPage: { screen: ChatPage },
    TransferPage: { screen: TransferPage },
    ActivityPage: { screen: ActivityPage },
    Transaction: { screen: Transaction },
    Refuel: { screen: Refuel },
    Assets: { screen: AssetsContainer },
    BoardDetail: { screen: BoardDetail }
  },
  {
    initialRouteName: 'HomeTab',
    headerMode: 'none'
  }
)

const App = createSwitchNavigator(
  {
    Login: { screen: Login, uriPrefix: 'login/' },
    Main: { screen: MainNavigator },
    AppLoadingScreen: { screen: AppLoadingScreen }
  },
  {
    initialRouteName: 'AppLoadingScreen',
    headerMode: 'none'
  }
)
const RootPage = () => (
  <Root>
    <App uriPrefix={'http://open.milestone/'} />
  </Root>
)

export default RootPage
