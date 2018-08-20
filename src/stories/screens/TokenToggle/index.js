import * as React from 'react'
import { Platform, FlatList } from 'react-native'
import {
  Container,
  Header,
  Content,
  Body,
  Text,
  Icon,
  ListItem,
  Card,
  CardItem,
  Left,
  Button,
  Right
} from 'native-base'
import Search from '../../../utils/search.js'

class TokenToggle extends React.Component {
  renderItem = ({item}) => {
    return (
      <ListItem>
        <Body>
          <Text> {item.symbol} </Text>
          <Text note> {item.address} </Text>
        </Body>
        <Right>
          <Button transparent onPress={() => this.props.removeToken(item.symbol, item.address)} >
            <Icon name='ios-remove-circle-outline' />
          </Button>
        </Right>
      </ListItem>)
  }

  toSearchPage = () => {
    this.props.navigation.navigate('SearchPage', {
      search: Search.searchTokens,
      onItemSelected: this.props.addToken
    })
  }

  render () {
    let { tokens } = this.props

    return (<Container>
      <Header searchBar rounded>
        <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name='arrow-back' />
          </Button>
        </Left>
        <Right>
          {Platform.OS === 'ios' &&
            <Button transparent onPress={this.toSearchPage} >
              <Icon name='search' />
            </Button>
          }
          {Platform.OS === 'android' &&
            <Button onPress={this.toSearchPage} >
              <Icon name='search' />
            </Button>
          }
        </Right>
      </Header>
      <Content>
        { tokens && tokens.length > 0
          ? <FlatList
            data={tokens}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.address}
            extraData={this.props}
          />
          : <Card transparent>
            <CardItem>
              <Body>
                <Text>
                   No Tokens Available
                </Text>
              </Body>
            </CardItem>
          </Card>}
      </Content>
    </Container>)
  }
}

export default TokenToggle
