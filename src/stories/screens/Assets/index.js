import * as React from 'react'
import { Platform, RefreshControl, View } from 'react-native'
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
import { Row, Grid } from 'react-native-easy-grid'
import styles from './styles'
import { BigNumber } from 'bignumber.js'
import Identicon from 'identicon.js'

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
            <Text> {token.symbol } </Text>
          </Left>
          <Right>
            <Text> { this.format(token.balance) } </Text>
            <Text note> &#8776; { this.format(token.value) } </Text>
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
      <Container style={styles.container}>
        <Header span style={{ paddingTop: 30, backgroundColor: Platform.OS === 'ios' ? '#f8f8f8' : '#3f51b5'}}>
          <Grid>
            <Row size={3}>
              <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center'}}>
                <Thumbnail small source={{ uri: identiconBase64 }} />
              </View>
            </Row>
            <Row size={1}>
              <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={styles.textContent}> {walletAddressAbbre} </Text>
              </View>
            </Row>
            <Row size={3}>
              <Left>
                <Title style={{marginTop: Platform.OS === 'ios' ? 15 : 10}}> ≈ { totalVal }  </Title>
              </Left>
              <Right>
                {Platform.OS === 'ios' &&
                  <Button transparent onPress={this.addTokenOnPress} >
                    <Icon type='MaterialIcons' name='add-circle' />
                  </Button>
                }
                {Platform.OS === 'android' &&
                  <Button transparent onPress={this.addTokenOnPress}>
                    <Icon type='MaterialIcons' name='add-circle-outline' style={{fontSize: 37, color: 'white'}} />
                  </Button>
                }
              </Right>
            </Row>
          </Grid>
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
