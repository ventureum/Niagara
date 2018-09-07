import * as React from 'react'
import { Alert, SafeAreaView, View } from 'react-native'
import { Header, Body, Title, Button, Icon, Left, Right, Container } from 'native-base'
import PinKeyboard from '../../components/PinKeyboard'
import PinIndicator from '../../components/PinIndicator'
import LinearGradient from 'react-native-linear-gradient'

import styles from './styles'
export interface Props {
  navigation: any;
  pinCode: string;
}

class PinCode extends React.Component<Props, State> {
  state = {
    pinCode: ''
  };

  onAuthSuccess = () => {
    this.props.navigation.navigate('Drawer')
  };

  onBackPress = () => {
    this.setState({
      pinCode: this.state.pinCode.slice(0, -1)
    })
  };

  onKeyPress = n => {
    this.updatePinCode(n)
  };

  updatePinCode = n => {
    this.setState(
      {
        pinCode: `${this.state.pinCode}${n}`
      },
      () => {
        if (this.state.pinCode.length === 4) {
          if (this.state.pinCode === this.props.pinCode) {
            setTimeout(() => {
              this.onAuthSuccess()
            })
          } else {
            this.setState(
              {
                pinCode: ''
              },
              () => {
                Alert.alert(
                  'PIN Code',
                  'Your PIN code is incorrect. Please try again.'
                )
              }
            )
          }
        }
      }
    )
  };

  render () {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon
                active
                name='arrow-back'
                onPress={() => this.props.navigation.goBack()}
              />
            </Button>
          </Left>
          <Body>
            <Title >Enter Pin</Title>
          </Body>
          <Right />
        </Header>
        <View style={styles.container}>
          <PinIndicator length={this.state.pinCode.length} />
          <PinKeyboard
            onBackPress={this.onBackPress}
            onKeyPress={this.onKeyPress}
            onAuthSuccess={this.onAuthSuccess}
            showBackButton={this.state.pinCode.length > 0}
          />
        </View>
      </Container>
    )
  }
}

export default PinCode
