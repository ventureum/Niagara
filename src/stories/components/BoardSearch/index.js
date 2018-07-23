import * as React from 'react'
import { FlatList } from 'react-native'
import Search from '../../../utils/search.js'
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
import WalletUtils from '../../../utils/wallet'

class BoardSearch extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      boards: null
    }
  }

  renderItem = ({item}) => {
    console.log('render: ', item)
    return (
      <ListItem
        onPress={() => {
          this.props.switchBoard(item.key, item.value)
          this.props.goBack()
        }} >
        <Body>
          <Text> b/{item.key} </Text>
          <Text note> {item.value} </Text>
        </Body>
      </ListItem>)
  }

  handleTextChange = (text) => {
    let rv = Search.searchBoards(text)

    if (rv) {
      this.setState({
        boards: rv
      })
    }
  }

  render () {
    let { boards } = this.state

    return (<Container>
      <Header searchBar rounded>
        <Left>
          <Button transparent onPress={() => this.props.goBack()}>
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
        {boards && boards.length > 0
          ? <FlatList
            data={boards}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item.key}
          />
          : <Card>
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

export default BoardSearch
