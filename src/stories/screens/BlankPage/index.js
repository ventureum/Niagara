import * as React from 'react'
import { Container, Header, Title, Content, Text, Button, Icon, Left, Right, Body } from 'native-base'

import styles from './styles'
export interface Props {
  navigation: any;
}
export interface State {}
class BlankPage extends React.Component<Props, State> {
  render () {
    const param = this.props.navigation.state.params
    return (
      <Container style={styles.container}>
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

          <Body style={{ flex: 3 }}>
            <Title>{param ? param.name.item : 'Assets'}</Title>
          </Body>

          <Right />
        </Header>

        <Content padder>
          <Text>{param !== undefined ? param.name.item : 'Create Something Awesome . . .'}</Text>
        </Content>
      </Container>
    )
  }
}

export default BlankPage
