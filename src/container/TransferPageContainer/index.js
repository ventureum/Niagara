import React, { Component } from 'react'
import Transfer from '../../stories/screens/Transfer'

class TransferPageContainer extends Component {
  render () {
    return (
      <Transfer
        navigation={this.props.navigation}
      />
    )
  }
}

export default (TransferPageContainer)
