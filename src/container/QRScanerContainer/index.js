import React, { Component } from 'react'
import {Container} from 'native-base'
import QRScaner from '../../stories/screens/QRScaner'

export default class QRScanerContainer extends Component {
  render () {
    return (
      <Container>
        <QRScaner navigation={this.props.navigation} />
      </Container>
    )
  }
}
