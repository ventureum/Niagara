import React, { Component } from 'react'
import { Text, FlatList, View, Image } from 'react-native'
import { Container, Body, Header, Left, Right, Button, Icon, Title, Thumbnail, Card, CardItem } from 'native-base'
import styles from './styles'

console.ignoredYellowBox = ['Setting a timer']

export default class Discover extends Component {
  onRefresh = () => {
    this.props.refreshPosts()
    this.flatListRef.scrollToIndex({ animated: true, index: 0 })
  }

  onRenderItem = ({ item }) => {
    const actor = item.actor.slice(0, 8) + '...' + item.actor.slice(-6)
    let cardContent
    if (item.content.image === undefined) {
      cardContent = (
        <Body>
          <Text>
            {item.content.text}
          </Text>
        </Body>
      )
    } else {
      cardContent = (<Image source={{ uri: item.content.image }} style={{ height: 300, width: null, flex: 1 }} />)
    }
    return (
      <Card>
        <CardItem>
          <Left>
            <Thumbnail small source={{ uri: this.props.identiconBase64 }} />
            <Body>
              <Text style={styles.titleText}>{item.content.title}</Text>
              <Text style={styles.noteText}>{actor}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          {cardContent}
        </CardItem>
        <CardItem >
          <Left>
            <Button transparent>
              <Icon active name='thumbs-up' />
              <Text>12 Likes</Text>
            </Button>
          </Left>
          <Body>
            <Button transparent>
              <Icon active name='chatbubbles' />
              <Text>4 Comments</Text>
            </Button>
          </Body>
          <Right>
            <Text>11h ago</Text>
          </Right>
        </CardItem>
      </Card>
    )
  }

  render () {
    return (
      <Container>
        <Header >
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Discover</Title>
          </Body>
          <Right>
            <Button onPress={this.onRefresh} >
              <Icon name='refresh' />
            </Button>
          </Right>
        </Header>
        <FlatList
          data={this.props.posts}
          renderItem={this.onRenderItem}
          ref={(ref) => { this.flatListRef = ref }}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.7}
          onEndReached={this.props.getMorePosts}
        />
      </Container>
    )
  }
}
