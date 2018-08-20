import * as React from 'react'
import { RefreshControl, View, TouchableOpacity } from 'react-native'
import {
  Left,
  Container,
  Header,
  Title,
  Content,
  Text,
  Right,
  List,
  ListItem,
  Thumbnail,
  Button,
  Icon
} from 'native-base'
import { BigNumber } from 'bignumber.js'
import Identicon from 'identicon.js'
import styles from './styles'
import ventureum from '../../../theme/variables/ventureum'

var numeral = require('numeral')

class Assets extends React.Component {
  constructor (props) {
    super(props)
    this.tokenListOnPress = this.tokenListOnPress.bind(this)
  }

  format (val) {
    if (BigNumber.isBigNumber(val)) {
      val = val.toNumber()
    }
    if (val > 1000) {
      return numeral(val.toString()).format('0.0 a')
    } else {
      return numeral(val.toString()).format('0.000')
    }
  }

  tokenListOnPress (tokenIdx) {
    this.props.navigation.navigate('SendAndReceive', {
      tokenIdx: tokenIdx
    })
  }

  onRefresh () {
    this.props.refreshTokens()
  }

  addTokenOnPress = () => {
    this.props.navigation.navigate('TokenToggle')
  }

  render () {
    let { tokens, totalVal, walletAddress } = this.props

    const listItems = tokens.map((token, i) => {
      return (
        <ListItem key={i} onPress={() => this.tokenListOnPress(i)}>
          <Left>
            <Text> {token.symbol} </Text>
          </Left>
          <Right>
            <Text> {this.format(token.balance)} </Text>
            <Text note> &#8776; {this.format(token.value)} </Text>
          </Right>
        </ListItem>)
    })

    const listContent = (
      <List>
        {listItems}
      </List>
    )

    let walletAddressAbbre = walletAddress.slice(0, 8) + '...' + walletAddress.slice(-6)
    let identiconData = new Identicon(walletAddress, 64).toString()
    let identiconBase64 = 'data:image/png;base64,' + identiconData
    return (
      <Container>
        <Header span>
          <View style={styles.headerContainer}>
            <View style={styles.userInfoContainer}>
              <View style={styles.avatarContainer}>
                <Thumbnail small source={{ uri: identiconBase64 }} />
              </View>
              <View style={styles.addressContainer}>
                <Text> {walletAddressAbbre} </Text>
              </View>
            </View>
            <View style={styles.wealthContainer}>
              <Title> ≈ {totalVal}  </Title>
              <TouchableOpacity onPress={this.addTokenOnPress}>
                <Icon
                  type='SimpleLineIcons'
                  name='magnifier-add'
                  style={{ fontSize: 28, color: ventureum.secondaryColor }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Header>
        <Content refreshControl={
          <RefreshControl refreshing={this.props.loading}
            onRefresh={this.onRefresh.bind(this)}
          />} >
          {listContent}
        </Content>
      </Container>

    )
  }
}

export default Assets
