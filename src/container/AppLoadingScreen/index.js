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
    if (!this.props.userLoaded) {
      return this.props.navigation.navigate('Login')
    }
    return this.props.navigation.navigate('Main')
  }

  render () {
    return null
  }
}

const mapStateToProps = state => ({
  userLoaded: state.profileReducer.userLoaded
})

export default connect(mapStateToProps)(AppLoadingScreen)
