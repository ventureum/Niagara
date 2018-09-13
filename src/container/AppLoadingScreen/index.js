import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class AppLoadingScreen extends Component {
  static propTypes = {
    profile: PropTypes.object
  };

  static defaultProps = {
    profile: null
  };

  componentDidMount () {
    if (this.props.profile === null) {
      return this.props.navigation.navigate('Login')
    }
    return this.props.navigation.navigate('Main')
  }

  render () {
    return null
  }
}

const mapStateToProps = state => ({
  profile: state.profileReducer.profile
})

export default connect(mapStateToProps)(AppLoadingScreen)
