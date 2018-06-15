import React, { Component } from 'react'
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body } from 'native-base'
import SendPage from '../../stories/screens/SendPage'

export default class SendPageContainer extends Component {
  render () {
    return (
      <Container>
        <SendPage navigation={this.props.navigation} />
      </Container>
    )
  }
}
