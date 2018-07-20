import React, { Component } from 'react'
import { Title, Text, Content, Header, Container, Body, ListItem, Left, Icon, Button } from 'native-base'

export default class Profile extends Component {
  render () {
    return (
      <Container>
        <Header >
          <Title>Profile </Title>
        </Header >
        <Content>
          <ListItem icon
            onPress={() => {
              this.props.navigation.navigate('Transaction')
            }}>
            <Left>
              <Button style={{ backgroundColor: '#FF9501' }}>
                <Icon active name='list' />
              </Button>
            </Left>
            <Body>
              <Text>Transactions</Text>
            </Body>
          </ListItem>
        </Content>
      </Container>
    )
  }
}
