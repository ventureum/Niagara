import * as React from 'react'
import { FlatList } from 'react-native'
import {
  Item,
  Input,
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
  Button
} from 'native-base'

class SearchPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      searchResults: null
    }
  }

  renderItem = ({item}) => {
    const onItemSelected = this.props.navigation.getParam('onItemSelected', (k, v) => {})
    return (
      <ListItem
        onPress={() => {
          onItemSelected(item.key, item.value)
          this.props.navigation.goBack()
        }} >
        <Body>
          <Text> {item.key} </Text>
          <Text note> {item.value} </Text>
        </Body>
      </ListItem>)
  }

  handleTextChange = (text) => {
    const search = this.props.navigation.getParam('search', (k) => {})
    let rv = search(text)
    if (rv) {
      this.setState({
        searchResults: rv
      })
    }
  }

  render () {
    let { searchResults } = this.state

    return (<Container>
      <Header searchBar rounded>
        <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name='arrow-back' />
          </Button>
        </Left>
        <Item>
          <Icon name='ios-search' />
          <Input
            placeholder='Search'
            onChangeText={this.handleTextChange}
          />
        </Item>
      </Header>
      <Content>
        { searchResults && searchResults.length > 0
          ? <FlatList
            data={searchResults}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.value}
          />
          : <Card transparent>
            <CardItem>
              <Body>
                <Text>
                  No results
                </Text>
              </Body>
            </CardItem>
          </Card>}
      </Content>
    </Container>)
  }
}

export default SearchPage
