import React, { Component } from 'react'
import { Tab, Tabs, Text, Header, ListItem, Left, Icon, Right, Button, Thumbnail, List } from 'native-base'
import { View, TouchableOpacity, ScrollView, Animated } from 'react-native'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'

const MAX_USER_INFO_HEIGHT = 150

export default class Profile extends Component {
  onRefresh = () => {
    this.props.fetchProfile()
  }

  render () {
    const { userName, photoUrl, level } = this.props.profile
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
              <Thumbnail square source={photoUrl === '' ? { uri: 'https://placeimg.com/120/120/any' } : photoUrl} />
              <Text style={styles.name}>
                {userName}
              </Text>
              <View style={styles.lvBadge}>
                <Text style={styles.lvText}>
                  Lv {level}
                </Text>
              </View>
            </View>
            <View style={styles.assetInfo}>
              <View style={styles.milestoneInfoContainer}>
                <Text style={styles.milestonePoints}>
                  {this.props.profile.rewardsInfo
                    ? this.props.profile.rewardsInfo.milestonePoints
                    : 0
                  }
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
