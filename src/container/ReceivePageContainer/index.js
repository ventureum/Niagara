import React, { Component } from 'react'
import { Container } from 'native-base'
import ReceivePage from '../../stories/screens/ReceivePage'

export default class SendPageContainer extends Component {
  render () {
    return (
      <Container>
        <ReceivePage navigation={this.props.navigation} />
      </Container>
    )
  }
}
