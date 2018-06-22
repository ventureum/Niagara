// @flow
import * as React from 'react'
import BlankPage from '../BlankPageContainer'
import TCRContainer from '../TCRContainer'
import { TabNavigator } from 'react-navigation'
import { Button, Text, Icon, Footer, FooterTab } from 'native-base'
import Assets from '../AssetsContainer'

export interface Props {
  navigation: any;
}
export default (MainScreenNavigator = TabNavigator(
  {
    Assets: { screen: Assets },
    TCR: { screen: TCRContainer }
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
              <Icon name='view-list' type='MaterialCommunityIcons' />
              <Text>TCR</Text>
            </Button>
            <Button
              vertical
              active={props.navigationState.index === 2}
              onPress={() => props.navigation.navigate('Discover')}>
              <Icon name='compass' />
              <Text>Discover</Text>
            </Button>
            <Button
              vertical
              active={props.navigationState.index === 3}
              onPress={() => props.navigation.navigate('Profile')}>
              <Icon name='person' type='MaterialIcons' />
              <Text>Profile</Text>
            </Button>
          </FooterTab>
        </Footer>
      )
    }
  }
))
