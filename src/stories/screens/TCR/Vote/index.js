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
  Toast,
  Spinner
} from 'native-base'
import { Modal, RefreshControl } from 'react-native'
import tcr from '../../../../services/tcr'
import { BigNumber } from 'bignumber.js'
import update from 'immutability-helper'
import styles from './styles'
import ventureum from '../../../../theme/variables/ventureum'

export interface Props {
  navigation: any;
  list: any;
  delisted: Function;
  whitelisted: Function;
  voted: Function;
  loading: String;
}
export interface State {}

const big = (number) => new BigNumber(number.toString(10))
const tenToTheEighteenth = big(10).pow(big(18))

class Vote extends React.Component<Props, State> {
  state = {
    projectList: this.props.list && typeof (this.props.list.votingList) === typeof ([]) && this.props.list.votingList,
    modalVisible: false,
    voteOption: true,
    amount: null,
    selectedItem: null
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      projectList: nextProps.list && typeof (nextProps.list.votingList) === typeof ([]) && nextProps.list.votingList
    })
  }

  setModalVisible (visible, item) {
    if (item) {
      this.setState({
        modalVisible: visible,
        selectedItem: item
      })
    } else {
      this.setState({
        modalVisible: visible
      })
    }
  }

  setItemProcess (item, value = true) {
    let index = this.state.projectList.indexOf(item)
    if (index < 0) {
      return
    }
    this.setState({
      projectList: update(this.state.projectList, {
        [index]: {
          processing: {
            $set: value
          }
        }
      })
    })
  }

  async delist (item) {
    this.setItemProcess(item)
    Toast.show({
      text: 'The operation is processing',
      buttonText: 'Okay',
      type: 'success'
    })
    var _this = this
    setTimeout(async function () {
      try {
        await tcr.delist(item)
        Toast.show({
          text: 'The project has been delisted',
          buttonText: 'Okay',
          type: 'success'
        })
        _this.props.delisted()
      } catch (e) {
        Toast.show({
          text: e.message,
          buttonText: 'Okay',
          type: 'danger'
        })
        _this.setItemProcess(item, false)
      }
    }, 0)
  }

  async whitelist (item) {
    this.setItemProcess(item)
    Toast.show({
      text: 'The operation is processing',
      buttonText: 'Okay',
      type: 'success'
    })
    var _this = this
    setTimeout(async function () {
      try {
        await tcr.whitelist(item)
        Toast.show({
          text: 'The project has been whitelisted',
          buttonText: 'Okay',
          type: 'success'
        })
        _this.props.whitelisted()
      } catch (e) {
        Toast.show({
          text: e.message,
          buttonText: 'Okay',
          type: 'danger'
        })
        _this.setItemProcess(item, false)
      }
    }, 0)
  }

  async vote () {
    var selectedItem = this.state.selectedItem
    this.setItemProcess(selectedItem)
    Toast.show({
      text: 'The operation is processing',
      buttonText: 'Okay',
      type: 'success'
    })
    var _this = this
    this.setModalVisible(false)
    setTimeout(async function () {
      try {
        await tcr.vote(selectedItem.hash, _this.state.voteOption, big(_this.state.amount).multipliedBy(tenToTheEighteenth))
        Toast.show({
          text: 'The project has been voted',
          buttonText: 'Okay',
          type: 'success'
        })
        _this.setItemProcess(selectedItem, false)
        _this.props.voted()
      } catch (e) {
        Toast.show({
          text: e.message,
          buttonText: 'Okay',
          type: 'danger'
        })
        _this.setItemProcess(selectedItem, false)
      }
    }, 0)
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
                  <Text style={{color: 'black'}}>Support</Text>
                  <Right>
                    <Radio onPress={() => { this.setState({voteOption: true}) }} selectedColor={'#5cb85c'} selected={this.state.voteOption} />
                  </Right>
                </ListItem>
                <ListItem style={[styles.optionWithBorder, styles.withPadding]}
                  onPress={() => { this.setState({voteOption: false}) }}
                  selected={!this.state.voteOption}>
                  <Text style={{color: 'black'}}>Against</Text>
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
          {this.state.projectList &&
            this.state.projectList.map((item, i) => (
              <ListItem
                key={i}
              >
                <Body style={styles.body}>
                  <Text>{item.hash}</Text>
                  {item.inProgress &&
                    <Text note>Support: {typeof (item.voteFor) === typeof ('') ? big(item.voteFor).div(tenToTheEighteenth).toNumber() : item.voteFor.div(tenToTheEighteenth).toNumber()} | Against: {typeof (item.voteAgainst) === typeof ('') ? big(item.voteAgainst).div(tenToTheEighteenth).toNumber() : item.voteAgainst.div(tenToTheEighteenth).toNumber()}</Text>
                  }
                </Body>
                <Right>
                  {item.inProgress &&
                    <Button
                      block
                      disabled={item.processing}
                      onPress={() => { this.setModalVisible(true, item) }}>
                      {!item.processing && <Text style={styles.wide}>Vote</Text>}
                      {item.processing && <Spinner style={styles.spin} size='small' color={ventureum.secondaryColor} />}
                    </Button>
                  }
                  {!item.inProgress && item.canBeWhitelisted &&
                    <Button
                      block
                      disabled={item.processing}
                      onPress={() => { this.whitelist(item) }}>
                      {!item.processing && <Text style={styles.wide}>Whitelist</Text>}
                      {item.processing && <Spinner style={styles.spin} size='small' color={ventureum.secondaryColor} />}
                    </Button>
                  }
                  {!item.inProgress && !item.canBeWhitelisted &&
                    <Button
                      block
                      disabled={item.processing}
                      onPress={() => { this.delist(item) }}>
                      {!item.processing && <Text style={styles.wide}>Delist</Text>}
                      {item.processing && <Spinner style={styles.spin} size='small' color={ventureum.secondaryColor} />}
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
