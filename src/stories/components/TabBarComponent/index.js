// @flow
import React, { Component } from 'react'
import { Button, Text, Icon, Footer, FooterTab } from 'native-base'
import { connect } from 'react-redux'
import { AppState, Alert } from 'react-native'
import { store } from '../../../boot/configureStore'
import { clearLoginInfo } from '../../../actions'
class TabBarComponent extends Component {
  state = {
    appState: AppState.currentState
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const token = store.getState().networkReducer.accessToken
      if (!this.isTokenValid(token)) {
        Alert.alert(
          'Session expired',
          'Please login again.',
          [
            {
              text: 'Ok',
              onPress: () => {
                this.props.navigation.navigate('Login')
                this.props.clearLoginInfo()
              }
            }
          ],
          { cancelable: false }
        )
      }
    } else {
      this.setState({ appState: nextAppState })
    }
  }

  isTokenValid = (token) => {
    const { exp } = token
    // check if token will expire in 3 hours
    return ((Date.now() / 1000) + (3600 * 3) < exp)
  }

  render () {
    const { index } = this.props.navigation.state
    return (
      <Footer>
        <FooterTab>
          <Button
            vertical
            active={index === 0}
            onPress={() => this.props.navigation.navigate('Home')}>
            <Icon name='coin' type='MaterialCommunityIcons' />
            <Text>Home</Text>
          </Button>
          <Button
            vertical
            active={index === 1}
            onPress={() => this.props.navigation.navigate('Discover')}>
            <Icon name='format-list-bulleted' type='MaterialCommunityIcons' />
            <Text>Discover</Text>
          </Button>
          <Button
            vertical
            active={index === 2}
            onPress={() => this.props.navigation.navigate('TCR')}>
            <Icon type='MaterialCommunityIcons' name='compass-outline' />
            <Text>TCR</Text>
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

const mapDispatchToProps = (dispatch) => ({
  clearLoginInfo: () => dispatch(clearLoginInfo())
})

export default connect(null, mapDispatchToProps)(TabBarComponent)
