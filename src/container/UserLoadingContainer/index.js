import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  registerUser,
  setAccessToken,
  loginUser
} from '../../actions'
import UserLoadingScreen from '../../stories/screens/UserLoadingScreen'

class UserLoadingContainer extends Component {
  render () {
    return (
      <UserLoadingScreen
        navigation={this.props.navigation}
        urlKey={this.props.navigation.getParam('urlKey', '')}
        registerUser={this.props.registerUser}
        userLoaded={this.props.userLoaded}
        setAccessToken={this.props.setAccessToken}
        accessToken={this.props.accessToken}
        loginUser={this.props.loginUser}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) =>
  ({
    registerUser: (idRoot, username, telegramId) => dispatch(registerUser(idRoot, username, telegramId)),
    setAccessToken: (token) => dispatch(setAccessToken(token)),
    loginUser: (actor, username, telegramId) => dispatch(loginUser(actor, username, telegramId))
  })

const mapStateToProps = state => ({
  userLoaded: state.profileReducer.userLoaded,
  accessToken: state.networkReducer.accessToken
})

export default connect(mapStateToProps, mapDispatchToProps)(UserLoadingContainer)
