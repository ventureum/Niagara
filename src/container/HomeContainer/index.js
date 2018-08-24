// @flow
import * as React from 'react'
import TCRContainer from '../TCRContainer'
import { TabNavigator } from 'react-navigation'
import { Button, Text, Icon, Footer, FooterTab } from 'native-base'
import Assets from '../AssetsContainer'
import Discover from '../DiscoverContainer'
import Profile from '../ProfileContainer'

export interface Props {
  navigation: any;
}
export default (MainScreenNavigator = TabNavigator(
  {
    Assets: { screen: Assets },
    TCR: { screen: TCRContainer },
    Discover: { screen: Discover },
    Profile: {screen: Profile}
  },
  {
    tabBarPosition: 'bottom',
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab>
            <Button
              vertical
              active={props.navigationState.index === 0}
              onPress={() => props.navigation.navigate('Assets')}>
              <Icon name='coin' type='MaterialCommunityIcons' />
              <Text>Assets</Text>
            </Button>
            <Button
              vertical
              active={props.navigationState.index === 1}
              onPress={() => props.navigation.navigate('TCR')}>
              <Icon name='format-list-bulleted' type='MaterialCommunityIcons' />
              <Text>TCR</Text>
            </Button>
            <Button
              vertical
              active={props.navigationState.index === 2}
              onPress={() => props.navigation.navigate('Discover')}>
              <Icon type='MaterialCommunityIcons' name='compass-outline' />
              <Text>Discover</Text>
            </Button>
            <Button
              vertical
              active={props.navigationState.index === 3}
              onPress={() => props.navigation.navigate('Profile')}>
              <Icon name='person-outline' type='MaterialIcons' />
              <Text>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      )
    }
  }
))
