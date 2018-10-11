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

export interface Props {
  navigation: any;
  list: any;
  delisted: Function;
  whitelisted: Function;
  voted: Function;
  refreshProject: Function;
  loading: String;
}
export interface State { }
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
          <Right>
            <Button transparent
              onPress={() => {
                this.props.refreshProject()
              }}
            >
              <Icon
                active
                name='refresh'
              />
            </Button>
          </Right>
        </Header>
        <Tabs initialPage={0}>
          <Tab heading='Whitelisted'>
            <Whitelisted
              loading={this.props.loading}
              refreshProject={this.props.refreshProject}
              navigation={this.props.navigation}
              list={this.props.list} />
          </Tab>
          <Tab heading='Vote'>
            <Vote
              loading={this.props.loading}
              refreshProject={this.props.refreshProject}
              navigation={this.props.navigation}
              list={this.props.list}
              delisted={this.props.delisted}
              whitelisted={this.props.whitelisted}
              voted={this.props.voted} />
          </Tab>
          <Tab heading='Pending'>
            <Pending
              loading={this.props.loading}
              refreshProject={this.props.refreshProject}
              navigation={this.props.navigation}
              list={this.props.list} />
          </Tab>
        </Tabs>
      </Container>
    )
  }
}

export default TCR
