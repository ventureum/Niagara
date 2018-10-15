import React, { Component } from 'react'
import { Container, Header, Left, Right, Button, Icon, Body, Title, ListItem, Tabs, Tab, List } from 'native-base'
import { View, Text, ScrollView } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'
import styles from './styles'
let moment = require('moment')

export default class Transfer extends Component {
  renderRecentVotes = (recentVotes) => {
    let listItems = []
    recentVotes.forEach((vote, i) => {
      listItems.push(
        <View key={i} style={styles.listItemContainer}>
          <View style={styles.actionInfoContainer}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemTitle}>Voted a post from @{vote.postOwnerUsername}</Text>
              <Text style={styles.listItemSubTitle}>{vote.content.subtitle}</Text>
            </View>
            <View style={styles.listItemRight}>
              <Text style={styles.listItemTitle}>{vote.deltaMilestonePoints}</Text>
            </View>
          </View>
          <Text style={styles.date}>
            {moment(vote.createdAt).format('MMMM Do YYYY')}
          </Text>
        </View>
      )
    })
    return (
      <ScrollView>
        <List>
          <ListItem itemHeader first style={{
            justifyContent: 'space-between',
            paddingLeft: ventureum.basicPadding * 2,
            paddingRight: ventureum.basicPadding * 2
          }}>
            <Text>VOTES</Text>
            <Text>MSP</Text>
          </ListItem>
          {listItems.length === 0
            ? <Text style={{alignSelf: 'center'}}>No recent votes were found.</Text>
            : listItems
          }
        </List >
      </ScrollView>
    )
  }

  renderRecentPosts = (recentPosts) => {
    let listItems = []
    recentPosts.forEach((post, i) => {
      listItems.push(
        <View key={i} style={styles.listItemContainer}>
          <View style={styles.actionInfoContainer}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemTitle}>Made a post @{post.postOwnerUsername}</Text>
              <Text style={styles.listItemSubTitle}>{post.content.subtitle}</Text>
            </View>
            <View style={styles.listItemRight}>
              <Text style={styles.listItemTitle}>{post.deltaMilestonePoints}</Text>
            </View>
          </View>
          <Text style={styles.date}>
            {moment(post.createdAt).format('MMMM Do YYYY')}
          </Text>
        </View>
      )
    })
    return (
      <ScrollView>
        <List>
          <ListItem itemHeader first style={{
            justifyContent: 'space-between',
            paddingLeft: ventureum.basicPadding * 2,
            paddingRight: ventureum.basicPadding * 2
          }}>
            <Text>POSTS</Text>
            <Text>MSP</Text>
          </ListItem>
          {listItems.length === 0
            ? <Text style={{alignSelf: 'center'}}>No recent posts were found.</Text>
            : listItems
          }
        </List >
      </ScrollView>
    )
  }

  renderRecentComments = (recentComments) => {
    let listItems = []
    recentComments.forEach((comment, i) => {
      listItems.push(
        <View key={i} style={styles.listItemContainer}>
          <View style={styles.actionInfoContainer}>
            <View style={styles.listItemLeft}>
              <Text style={styles.listItemTitle}>Commented a post from @{comment.postOwnerUsername}</Text>
              <Text style={styles.listItemSubTitle}>{comment.content.subtitle}</Text>
            </View>
            <View style={styles.listItemRight}>
              <Text style={styles.listItemTitle}>{comment.deltaMilestonePoints}</Text>
            </View>
          </View>
          <Text style={styles.date}>
            {moment(comment.createdAt).format('MMMM Do YYYY')}
          </Text>
        </View>
      )
    })
    return (
      <ScrollView>
        <List>
          <ListItem itemHeader first style={{
            justifyContent: 'space-between',
            paddingLeft: ventureum.basicPadding * 2,
            paddingRight: ventureum.basicPadding * 2
          }}>
            <Text>REPLIES</Text>
            <Text>MSP</Text>
          </ListItem>
          {listItems.length === 0
            ? <Text style={{alignSelf: 'center'}}>No recent replies were found.</Text>
            : listItems
          }
        </List >
      </ScrollView>
    )
  }
  render () {
    const { recentPosts, recentComments, recentVotes } = this.props
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
        <Tabs>
          <Tab heading='VOTES'>
            {this.renderRecentVotes(recentVotes)}
          </Tab>
          <Tab heading='POSTS'>
            {this.renderRecentPosts(recentPosts)}
          </Tab>
          <Tab heading='REPLIES'>
            {this.renderRecentComments(recentComments)}
          </Tab>
        </Tabs>
      </Container>
    )
  }
}
