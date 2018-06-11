import React, { Component } from 'react';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base'

export default class TabFooter extends Component {
  onTabChange (tabName) {

  }

  render() {
    return (
      <Footer>
        <FooterTab>
          <Button vertical active={this.props.active === 'assets'}
            onPress={() => this.onTabChange('assets')}
          >
            <Icon name="coin" type="MaterialCommunityIcons" />
            <Text>Assets</Text>
          </Button>
          <Button vertical active={this.props.active === 'tcr'}
            onPress={() => this.onTabChange('tcr')}
          >
            <Icon name="view-list" type="MaterialCommunityIcons" />
            <Text>TCR</Text>
          </Button>
          <Button vertical active={this.props.active === 'discover'}
            onPress={() => this.onTabChange('discover')}
          >
            <Icon active name="compass" />
            <Text>Discover</Text>
          </Button>
          <Button vertical active={this.props.active === 'profile'}
            onPress={() => this.onTabChange('profile')}
          >
            <Icon name="person" type="MaterialIcons" />
            <Text>Profile</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}
