import React, { Component } from 'react'
import { Container, Header, Left, Right, Button, Icon, Body, Title, ListItem, Tabs, Tab, List } from 'native-base'
import { View, Text, ScrollView } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'
import styles from './styles'

export default class Transfer extends Component {
  renderActivityList = () => {
    return (
      <ScrollView>
        <Tabs>
          <Tab heading='VOTING'>
            {this.renderContentList('VOTING')}
          </Tab>
          <Tab heading='POST'>
            {this.renderContentList('POST')}
          </Tab>
          <Tab heading='REPLY'>
            {this.renderContentList('REPLY')}
          </Tab>
        </Tabs>
      </ScrollView>
    )
  }

  generateListItems = (typeName) => {
    let listItems = []
    let type = ''
    let randomNames = ['santi', 'Barli', 'Tim', 'Lucas', 'Ven']
    let randomSubtitle = [
      'In today\'s net-savvy world it has become common for any',
      'Gaza is like any place in the world',
      'I often think about how close our starting',
      'Atef Abu Saif had one of the formative experiences',
      'During the 2014 conflict, writing the journal'
    ]
    for (let i = 0; i < 30; i++) {
      const Gain = Math.round((Math.random() * 100) + 1)
      const binaryRandom = Math.round((Math.random() * 1) + 1)
      const nameIndex = Math.round((Math.random() * 4))
      const subIndex = Math.round((Math.random() * 4))
      switch (typeName) {
        case 'VOTING':
          type = binaryRandom === 1 ? 'Upvoted' : 'Downvoted'
          break
        case 'POST':
          type = 'Posted'
          break
        default:
          type = 'Replied'
          break
      }
      listItems.push(
        <View key={i} style={styles.listItemContainer}>
          <View style={styles.actionInfoContainer}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemTitle}>{type} a post from @{randomNames[nameIndex]}</Text>
              <Text style={styles.listItemSubTitle}>{randomSubtitle[subIndex]}</Text>
            </View>
            <View style={styles.listItemRight}>
              <Text style={styles.listItemTitle}>+{Gain}</Text>
            </View>
          </View>
          <Text style={styles.date}>
            2018-08-07
          </Text>
        </View>
      )
    }
    return listItems
  }

  renderContentList = (typeName, data) => {
    return (
      <List>
        <ListItem itemHeader first style={{
          justifyContent: 'space-between',
          paddingLeft: ventureum.basicPadding * 2,
          paddingRight: ventureum.basicPadding * 2
        }}>
          <Text>{typeName}</Text>
          <Text>MSP</Text>
        </ListItem>
        {this.generateListItems(typeName)}
      </List>
    )
  }

  render () {
    return (
      <Container>
        <Header hasTabs>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-small-left' type='Entypo' />
            </Button>
          </Left>
          <Body>
            <Title>Activity</Title>
          </Body>
          <Right />
        </Header >
        {this.renderActivityList()}
      </Container>
    )
  }
}
