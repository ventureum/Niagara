import React, { Component } from 'react'
import Profile from '../../stories/screens/Profile'

export default class ProfileContainer extends Component {
  render () {
    return (
      <Profile navigation={this.props.navigation} />
    )
  }
}
