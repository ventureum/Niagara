import * as React from 'react'
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Left,
  Body,
  Right,
  Tab,
  Tabs
} from 'native-base'
import Whitelisted from './Whitelisted'
import Vote from './Vote'
import Pending from './Pending'

import styles from './styles'
export interface Props {
  navigation: any;
  list: any;
  delisted: Function;
  whitelisted: Function;
  voted: Function;
}
export interface State {}
class TCR extends React.Component<Props, State> {
  render () {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                active
                name='menu'
                onPress={() => this.props.navigation.openDrawer()}
              />
            </Button>
          </Left>
          <Body>
            <Title>TCR</Title>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0}>
          <Tab heading='Whitelisted'>
            <Whitelisted navigation={this.props.navigation} list={this.props.list} />
          </Tab>
          <Tab heading='Vote'>
            <Vote navigation={this.props.navigation} list={this.props.list} delisted={this.props.delisted} whitelisted={this.props.whitelisted} voted={this.props.voted} />
          </Tab>
          <Tab heading='Pending'>
            <Pending navigation={this.props.navigation} list={this.props.list} />
          </Tab>
        </Tabs>
      </Container>
    )
  }
}

export default TCR
