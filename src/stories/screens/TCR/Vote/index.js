import * as React from 'react'
import {
  Container,
  Content,
  Text,
  List,
  ListItem,
  Item,
  Button,
  Body,
  Right,
  Form,
  Input,
  Radio,
  Header,
  Left,
  Icon,
  Title,
  Toast
} from 'native-base'
import { Modal, RefreshControl } from 'react-native'
import tcr from '../../../../services/tcr'
import styles from './styles'
export interface Props {
  navigation: any;
  list: any;
  delisted: Function;
  whitelisted: Function;
  voted: Function;
  loading: String;
}
export interface State {}
class Vote extends React.Component<Props, State> {
  state = {
    modalVisible: false,
    voteOption: true,
    amount: null,
    selectedItem: null
  }

  setModalVisible (visible, item) {
    this.setState({
      modalVisible: visible,
      selectedItem: item
    })
  }

  async delist (item) {
    try {
      await tcr.delist(item)
      Toast.show({
        text: 'The project has been delisted',
        buttonText: 'Okay',
        type: 'success'
      })
      this.props.delisted()
    } catch (e) {
      Toast.show({
        text: e.message,
        buttonText: 'Okay',
        type: 'danger'
      })
    }
  }

  async whitelist (item) {
    try {
      await tcr.whitelist(item)
      Toast.show({
        text: 'The project has been whitelisted',
        buttonText: 'Okay',
        type: 'success'
      })
      this.props.whitelisted()
    } catch (e) {
      Toast.show({
        text: e.message,
        buttonText: 'Okay',
        type: 'danger'
      })
    }
  }

  async vote () {
    try {
      await tcr.vote(this.state.selectedItem.hash, this.state.voteOption, this.state.amount)
      this.setModalVisible(false)
      Toast.show({
        text: 'The project has been voted',
        buttonText: 'Okay',
        type: 'success'
      })
      this.props.voted()
    } catch (e) {
      Toast.show({
        text: e.message,
        buttonText: 'Okay',
        type: 'danger'
      })
    }
  }

  onValueChange (value) {
    this.setState({
      voteOption: value
    })
  }

  onTextChanged (text) {
    this.setState({
      amount: text
    })
  }

  render () {
    return (
      <Content refreshControl={
        <RefreshControl refreshing={this.props.loading}
          onRefresh={this.props.refreshProject}
        />}>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false, null)}>
          <Container>
            <Header>
              <Left>
                <Button transparent>
                  <Icon
                    active
                    name='arrow-back'
                    onPress={() => this.setModalVisible(false, null)}
                  />
                </Button>
              </Left>
              <Body>
                <Title>Vote</Title>
              </Body>
              <Right />
            </Header>
            <Content>
              <Form>
                <Item style={styles.first}>
                  <Text>Project Hash: {this.state.selectedItem && this.state.selectedItem.hash}</Text>
                </Item>
                <Item style={[styles.option, styles.withOutBorder]}>
                  <Text>Vote Option:</Text>
                </Item>
                <ListItem style={[styles.option, styles.withOutBorder, styles.withPadding]}
                  onPress={() => { this.setState({voteOption: true}) }}
                  selected={this.state.voteOption}>
                  <Text>Support</Text>
                  <Right>
                    <Radio onPress={() => { this.setState({voteOption: true}) }} selectedColor={'#5cb85c'} selected={this.state.voteOption} />
                  </Right>
                </ListItem>
                <ListItem style={[styles.optionWithBorder, styles.withPadding]}
                  onPress={() => { this.setState({voteOption: false}) }}
                  selected={!this.state.voteOption}>
                  <Text>Against</Text>
                  <Right>
                    <Radio onPress={() => { this.setState({voteOption: false}) }} selectedColor={'#5cb85c'} selected={!this.state.voteOption} />
                  </Right>
                </ListItem>
                <Item style={[styles.option, styles.withOutBorder]}>
                  <Text>Vote Amount:</Text>
                </Item>
                <Item style={styles.withOutBorder}>
                  <Input
                    bordered
                    onChangeText={(text) => this.onTextChanged(text)}
                    value={this.state.amount}
                    keyboardType='numeric'
                    placeholder='100' />
                </Item>
              </Form>
              <Button block style={styles.submit} disabled={!(this.state.amount > 0)}
                onPress={() => { this.vote() }}>
                <Text>Submit</Text>
              </Button>
            </Content>
          </Container>
        </Modal>
        <List>
          {this.props.list &&
            typeof (this.props.list.votingList) === typeof ([]) &&
            this.props.list.votingList.map((item, i) => (
              <ListItem
                key={i}
              >
                <Body>
                  <Text>{item.hash}</Text>
                  {item.inProgress &&
                    <Text note>Support: {typeof (item.voteFor) === typeof ('') ? item.voteFor : item.voteFor.toNumber()} | Against: {typeof (item.voteAgainst) === typeof ('') ? item.voteAgainst : item.voteAgainst.toNumber()}</Text>
                  }
                </Body>
                <Right>
                  {item.inProgress &&
                    <Button
                      onPress={() => { this.setModalVisible(true, item) }}>
                      <Text>Vote</Text>
                    </Button>
                  }
                  {!item.inProgress && item.canBeWhitelisted &&
                    <Button
                      onPress={() => { this.whitelist(item) }}>
                      <Text style={styles.wide}>Whitelist</Text>
                    </Button>
                  }
                  {!item.inProgress && !item.canBeWhitelisted &&
                    <Button
                      onPress={() => { this.delist(item) }}>
                      <Text>Delist</Text>
                    </Button>
                  }
                </Right>
              </ListItem>
            ))}
        </List>
      </Content>
    )
  }
}

export default Vote
