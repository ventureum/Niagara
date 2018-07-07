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
  CardItem
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
    return (
      <ListItem
        onPress={() => { this.props.onSelectBoard(item) }} >
        <Body>
          <Text> {item.symbol} </Text>
          <Text note> {item.address} </Text>
        </Body>
      </ListItem>)
  }

  handleTextChange = (text) => {
    let tokens = WalletUtils.getToken(text.toUpperCase(), null)
    this.setState({
      boards: tokens
    })
  }

  render () {
    let { boards } = this.state

    return (<Container>
      <Header searchBar rounded>
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
            keyExtractor={(item, index) => item.address}
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
