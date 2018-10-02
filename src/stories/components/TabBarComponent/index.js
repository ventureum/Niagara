// @flow
import React, { Component } from 'react'
import { Button, Text, Icon, Footer, FooterTab } from 'native-base'

export default class TabBarComponent extends Component {
  render () {
    const { index } = this.props.navigation.state
    return (
      <Footer>
        <FooterTab>
          <Button
            vertical
            active={index === 0}
            onPress={() => this.props.navigation.navigate('Assets')}>
            <Icon name='coin' type='MaterialCommunityIcons' />
            <Text>Assets</Text>
          </Button>
          <Button
            vertical
            active={index === 1}
            onPress={() => this.props.navigation.navigate('TCR')}>
            <Icon name='format-list-bulleted' type='MaterialCommunityIcons' />
            <Text>TCR</Text>
          </Button>
          <Button
            vertical
            active={index === 2}
            onPress={() => this.props.navigation.navigate('Discover')}>
            <Icon type='MaterialCommunityIcons' name='compass-outline' />
            <Text>Discover</Text>
          </Button>
          <Button
            vertical
            active={index === 3}
            onPress={() => this.props.navigation.navigate('Profile')}>
            <Icon name='person-outline' type='MaterialIcons' />
            <Text>Profile</Text>
          </Button>
        </FooterTab>
      </Footer>
    )
  }
}
