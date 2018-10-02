import React, { Component } from 'react'
import Activity from '../../stories/screens/Activity'

class ActivityPageContainer extends Component {
  render () {
    return (
      <Activity
        navigation={this.props.navigation}
      />
    )
  }
}

export default (ActivityPageContainer)
