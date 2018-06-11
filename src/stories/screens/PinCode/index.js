import * as React from "react";
import { Alert, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Left, Right, Footer } from "native-base";
import PinKeyboard from '../../components/PinKeyboard';
import PinIndicator from '../../components/PinIndicator';
import LinearGradient from 'react-native-linear-gradient';

import styles from "./styles";
export interface Props {
  navigation: any;
  pinCode: string;
}

class PinCode extends React.Component<Props, State> {
  state = {
    pinCode: '',
  };

  onAuthSuccess = () => {
    this.props.navigation.navigate('Drawer');
  };

  onBackPress = () => {
    this.setState({
      pinCode: this.state.pinCode.slice(0, -1),
    });
  };

  onKeyPress = n => {
    this.updatePinCode(n);
  };

  updatePinCode = n => {
    this.setState(
      {
        pinCode: `${this.state.pinCode}${n}`,
      },
      () => {
        if (this.state.pinCode.length === 4) {
          if (this.state.pinCode === this.props.pinCode) {
            setTimeout(() => {
              this.onAuthSuccess();
            });
          } else {
            this.setState(
              {
                pinCode: '',
              },
              () => {
                Alert.alert(
                  'PIN Code',
                  'Your PIN code is incorrect. Please try again.',
                );
              },
            );
          }
        }
      },
    );
  };

  render() {
    return (
      <LinearGradient colors={['#090909', '#181724']} style={styles.background}>
        <SafeAreaView style={styles.container}>
          <Header iosBarStyle='light-content' style={styles.header}>
            <Left>
              <Button transparent>
                <Icon
                  active
                  name="arrow-back"
                  onPress={() => this.props.navigation.goBack()}
                />
              </Button>
            </Left>
            <Body>
              <Title style={styles.title}>Enter Pin</Title>
            </Body>
            <Right />
          </Header>
          <PinIndicator length={this.state.pinCode.length} />
          <PinKeyboard
            onBackPress={this.onBackPress}
            onKeyPress={this.onKeyPress}
            onAuthSuccess={this.onAuthSuccess}
            showBackButton={this.state.pinCode.length > 0}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

export default PinCode;
