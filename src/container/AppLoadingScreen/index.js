import * as React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class AppLoadingScreen extends React.Component {
  static propTypes = {
    userLoaded: PropTypes.bool
  };

  static defaultProps = {
    userLoaded: false
  };

  componentDidMount () {
    const { userLoaded, accessToken } = this.props
    if (!userLoaded || !this.isTokenValid(accessToken)) {
      return this.props.navigation.navigate('Login')
    }
    return this.props.navigation.navigate('Main')
  }

  isTokenValid = (token) => {
    const { exp } = token
    // check if token will expire in 3 hours
    return (Date.now() / 1000) + (3600 * 3) < exp
  }

  render () {
    return null
  }
}

const mapStateToProps = state => ({
  userLoaded: state.profileReducer.userLoaded,
  accessToken: state.networkReducer.accessToken
})

export default connect(mapStateToProps)(AppLoadingScreen)
