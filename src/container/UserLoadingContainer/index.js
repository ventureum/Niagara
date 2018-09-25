import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setWalletAddress, setPrivateKey } from '../CreateWalletContainer/actions'
import { registerUser } from '../ProfileContainer/actions'
import UserLoadingScreen from '../../stories/screens/UserLoadingScreen'

class UserLoadingContainer extends Component {
  render () {
    return (
      <UserLoadingScreen
        navigation={this.props.navigation}
        setWalletAddress={this.props.setWalletAddress}
        setPrivateKey={this.props.setPrivateKey}
        urlKey={this.props.navigation.getParam('urlKey', '')}
        registerUser={this.props.registerUser}
        userLoaded={this.props.userLoaded}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) =>
  ({
    setWalletAddress: address => dispatch(setWalletAddress(address)),
    setPrivateKey: privKey => dispatch(setPrivateKey(privKey)),
    registerUser: (idRoot, userName, telegramId) => dispatch(registerUser(idRoot, userName, telegramId))
  })

const mapStateToProps = state => ({
  userLoaded: state.profileReducer.userLoaded
})

export default connect(mapStateToProps, mapDispatchToProps)(UserLoadingContainer)
