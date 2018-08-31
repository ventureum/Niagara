import React, { Component } from 'react'
import { Tab, Tabs, Text, Header, ListItem, Left, Icon, Right, Button, Thumbnail, List } from 'native-base'
import { View, TouchableOpacity, ScrollView, Animated } from 'react-native'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'

const MAX_USER_INFO_HEIGHT = 150

export default class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scrollY: new Animated.Value(0)
    }
  }

  // componentWillMount () {
  //   this.onRefresh()
  // }

  onRefresh = () => {
    // this.props.updateReputation()
  }

  generateListItems = () => {
    let listItems = []
    for (let i = 0; i < 30; i++) {
      listItems.push(
        <ListItem key={i} style={{ paddingLeft: null }}>
          <Left>
            <Text> Project1 </Text>
          </Left>
          <Right>
            <Text> 96 </Text>
          </Right>
        </ListItem>
      )
    }
    return listItems
  }

  renderContentList = (name, data) => {
    return (
      <List>
        <ListItem itemHeader first style={{
          justifyContent: 'space-between',
          paddingLeft: ventureum.basicPadding * 2,
          paddingRight: ventureum.basicPadding * 2
        }}>
          <Text>{name}</Text>
          <Text>GAIN</Text>
        </ListItem>
        {this.generateListItems()}
      </List>
    )
  }

  renderUserInfo = () => {
    const userInfoHeight = this.state.scrollY.interpolate({
      inputRange: [0, MAX_USER_INFO_HEIGHT],
      outputRange: [MAX_USER_INFO_HEIGHT, 0],
      extrapolate: 'clamp'
    })
    const userInfoOpacity = this.state.scrollY.interpolate({
      inputRange: [0, MAX_USER_INFO_HEIGHT - 20],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })
    return (
      <Animated.View style={[
        styles.userInfoContainer,
        {
          height: userInfoHeight,
          opacity: userInfoOpacity
        }
      ]}>
        <View style={styles.nameAndAvatar}>
          <Thumbnail square source={{ uri: 'https://placeimg.com/120/120/any' }} />
          <View style={styles.nameContainer} >
            <Text style={styles.name}>
              Williamleha
            </Text>
            <View style={styles.lvBadge}>
              <Text style={styles.lvText}>
                Lv 1
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.milestoneInfoContainer}>
          <Text style={styles.milestonePoints}>
            10,000
          </Text>
          <Text style={styles.milestoneText}>
            Milestone Points
          </Text>
        </View>
      </Animated.View>
    )
  }

  renderActivityList = () => {
    return (
      <ScrollView
        scrollEventThrottle={16}
        onScroll={
          Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
          )
        }>
        <Tabs style={{ flex: 1, marginTop: 150 }}>
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

  render () {
    return (
      <ScrollView style={{
        backgroundColor: ventureum.primaryColor,
        flex: 1
      }}>
        <Header span style={{
          height: 240,
          borderBottomWidth: null,
          paddingBottom: ventureum.basicPadding
        }}>
          <View style={styles.header}>
            <View style={styles.nameAndAvatar}>
              <Thumbnail square source={{ uri: 'https://placeimg.com/120/120/any' }} />
              <Text style={styles.name}>
                Williamleha
              </Text>
              <View style={styles.lvBadge}>
                <Text style={styles.lvText}>
                  Lv 1
                </Text>
              </View>
            </View>
            <View style={styles.assetInfo}>
              <View style={styles.milestoneInfoContainer}>
                <Text style={styles.milestonePoints}>
                  10,000
                </Text>
                <Text style={styles.milestoneText}>
                  Milestone Points
                </Text>
              </View>
              <View style={styles.vtxInfo}>
                <Text style={styles.milestonePoints}>
                  8.36
                </Text>
                <Text style={styles.vtxText}>
                  VTX
                </Text>
              </View>
            </View>
          </View>
        </Header>
        <ScrollView>
          <List>
            <ListItem noBorder
              onPress={() => {
                this.props.navigation.navigate('TransferPage')
              }}
            >
              <Left>
                <View style={styles.activityItem}>
                  <Text style={{ alignSelf: 'flex-start' }}>Transfer</Text>
                  <Text note>Next transfer scheduled on Sep 4</Text>
                </View>
              </Left>
              <Right>
                <Icon name='chevron-right' type='Entypo' />
              </Right>
            </ListItem>
            <ListItem noBorder onPress={() => {
              this.props.navigation.navigate('ActivityPage')
            }}>
              <Left>
                <Text style={{ alignSelf: 'flex-start' }}>Activity</Text>
              </Left>
              <Right>
                <Icon name='chevron-right' type='Entypo' />
              </Right>
            </ListItem>
            <ListItem noBorder>
              <Left>
                <Text>Account</Text>
              </Left>
              <Right>
                <Icon name='chevron-right' type='Entypo' />
              </Right>
            </ListItem>
            <ListItem noBorder >
              <Left>
                <Text>Notification</Text>
              </Left>
              <Right>
                <Icon name='chevron-right' type='Entypo' />
              </Right>
            </ListItem>
            <ListItem noBorder >
              <Left>
                <Text>privacy</Text>
              </Left>
              <Right>
                <Icon name='chevron-right' type='Entypo' />
              </Right>
            </ListItem>
            <ListItem noBorder >
              <Left>
                <Text>User Agreement</Text>
              </Left>
              <Right>
                <Icon name='chevron-right' type='Entypo' />
              </Right>
            </ListItem>
          </List>
        </ScrollView>
      </ScrollView>
    )
  }
}

/*  Old Header:
 <Header style={{ paddingBottom: null }}>
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
*/

/* Old:
renderUserInfo = () => {
  const userInfoHeight = this.state.scrollY.interpolate({
    inputRange: [0, MAX_USER_INFO_HEIGHT],
    outputRange: [MAX_USER_INFO_HEIGHT, 0],
    extrapolate: 'clamp'
  })
  const userInfoOpacity = this.state.scrollY.interpolate({
    inputRange: [0, MAX_USER_INFO_HEIGHT - 20],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })
  return (
    <Animated.View style={[
      styles.userInfoContainer,
      {
        height: userInfoHeight,
        opacity: userInfoOpacity
      }
    ]}>
      <View style={styles.nameAndAvatar}>
        <Thumbnail square source={{ uri: 'https://placeimg.com/120/120/any' }} />
        <View style={styles.nameContainer} >
          <Text style={styles.name}>
            Williamleha
          </Text>
          <View style={styles.lvBadge}>
            <Text style={styles.lvText}>
              Lv 1
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.milestoneInfoContainer}>
        <Text style={styles.milestonePoints}>
          10,000
        </Text>
        <Text style={styles.milestoneText}>
          Milestone Points
        </Text>
      </View>
    </Animated.View>
  )
}
*/

/* <Content>
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
              <Button style={{ backgroundColor: ventureum.secondaryColor }}>
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
              <Button style={{ backgroundColor: ventureum.secondaryColor }}>
                <Icon active name='ios-people-outline' />
              </Button>
            </Left>
            <Body>
              <Text>Get Reputation</Text>
            </Body>
          </ListItem>
        </Content> */
