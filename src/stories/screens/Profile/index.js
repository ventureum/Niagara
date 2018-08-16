import React, { Component } from 'react'
import { Text, Header, Title, Content, Container, Body, ListItem, Left, Icon, Right, Button, Thumbnail } from 'native-base'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'

export default class Profile extends Component {
  componentWillMount () {
    this.onRefresh()
  }

  onRefresh = () => {
    this.props.updateReputation()
  }

  render () {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                active
                name='menu'
                onPress={() => this.props.navigation.openDrawer()}
              />
            </Button>
          </Left>
          <Body>
            <Title>Profile</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{backgroundColor: '#f8f8f8'}}>
          <View style={styles.nameCardContainer}>
            <View style={styles.nameCard}>
              <Thumbnail circle large source={{ uri: this.props.avatar }} />
              <View style={styles.reputationContainer} >
                <Text style={{ padding: 10 }}>Reputation: {this.props.reputation}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.onRefresh()
                  }}
                >
                  <Icon small name='refresh' />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.paddingSpace} />
          <ListItem
            style={{height: 60}}
            icon
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
          <ListItem icon
            onPress={() => {
              this.props.navigation.navigate('RefuelReputation', {refreshProfile: this.onRefresh})
            }}>
            <Left>
              <Button style={{ backgroundColor: '#FF9501' }}>
                <Icon active name='ios-people-outline' />
              </Button>
            </Left>
            <Body>
              <Text>Get Reputation</Text>
            </Body>
          </ListItem>
        </Content>
      </Container>
    )
  }
}
