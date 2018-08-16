import React, { Component } from 'react'
import { Header, Body, Left, Button, Right, Container, Icon, Title, Content, Text } from 'native-base'
import { RefreshControl, FlatList } from 'react-native'
import TransactionItem from '../../components/TransactionItem'

export default class Transaction extends Component {
  onRenderItem = ({ item }) => {
    return (
      <TransactionItem transaction={item} />
    )
  }
  render () {
    let { transactions } = this.props
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Transactions</Title>
          </Body>
          <Right />
        </Header>
        {(transactions.length === 0)
          ? <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}
            refreshControl={
              <RefreshControl
                refreshing={this.props.loading}
                onRefresh={this.props.updateTransactionStatus}
              />}>
            <Text > No transaction information were found. </Text>
          </Content>
          : <FlatList
            data={transactions}
            renderItem={this.onRenderItem}
            ref={(ref) => { this.flatListRef = ref }}
            keyExtractor={item => item.hash}
            refreshControl={
              <RefreshControl
                refreshing={this.props.loading}
                onRefresh={this.props.updateTransactionStatus}
              />}
          />
        }
      </Container>
    )
  }
}
