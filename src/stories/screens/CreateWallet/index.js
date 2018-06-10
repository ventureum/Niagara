import * as React from "react";
import { Alert, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Left, Right, Footer } from "native-base";
import PinKeyboard from '../../components/PinKeyboard';
import PinIndicator from '../../components/PinIndicator';
import LinearGradient from 'react-native-linear-gradient';
import EthereumJsWallet from 'ethereumjs-wallet';

import styles from "./styles";
export interface Props {
  navigation: any;
}

class CreateWallet extends React.Component<Props, State> {
  state = {
    confirmationPinCode: '',
    pinCode: '',
    isConfirmation: false,
    wallet: null
  };

  onBackPress = () => {
    if (!this.state.isConfirmation) {
      this.setState({
        pinCode: this.state.pinCode.slice(0, -1),
      });
    } else {
      this.setState({
        confirmationPinCode: this.state.confirmationPinCode.slice(0, -1),
      });
    }
  };

  onKeyPress = n => {
    if (!this.state.isConfirmation) {
      this.updatePinCode(n);
    } else {
      this.updateConfirmationPinCode(n);
    }
  };

  updatePinCode = n => {
    this.setState(
      {
        pinCode: `${this.state.pinCode}${n}`,
      },
      () => {
        if (this.state.pinCode.length === 4) {
          this.setState({
            isConfirmation: true,
          });
        }
      },
    );
  };

  updateConfirmationPinCode = n => {
    this.setState(
      {
        confirmationPinCode: `${this.state.confirmationPinCode}${n}`,
      },
      async () => {
        if (
          this.state.confirmationPinCode.length === 4 &&
          this.state.pinCode === this.state.confirmationPinCode
        ) {
          this.props.setPinCode(this.state.pinCode);

          if (this.props.navigation.getParam('recoverMode', false)) {
            this.props.navigation.navigate('RecoverWallet');
            return;
          } else if (
            !this.props.navigation.getParam('editMode', false) &&
            !this.props.navigation.getParam('migrationMode', false)
          ) {
            this.generateWallet();
          }

          setTimeout(() => {
            Alert.alert(
              'Success',
              "Wallet created! Address: " + this.state.wallet.getAddressString(),
            );
            this.props.navigation.navigate('Home');
          });
        } else if (this.state.confirmationPinCode.length === 4) {
          this.setState(
            {
              pinCode: '',
              confirmationPinCode: '',
              isConfirmation: false,
            },
            () => {
              Alert.alert(
                'PIN Code',
                "Your PIN code doesn't match. Please try again.",
              );
            },
          );
        }
      },
    );
  };

  generateWallet () {
    const wallet = EthereumJsWallet.generate();
    this.props.setWalletAddress(wallet.getAddressString());
    this.props.setPrivateKey(wallet.getPrivateKey().toString('hex'));
    this.setState({
      wallet
    })
  }

  render() {
    const pinCode = this.state.isConfirmation
      ? this.state.confirmationPinCode
      : this.state.pinCode;

    const originalTitle = this.props.navigation.getParam('editMode', false)
      ? 'Change PIN'
      : 'Create PIN';

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
              <Title style={styles.title}>{this.state.isConfirmation ? 'Repeat PIN' : originalTitle}</Title>
            </Body>
            <Right />
          </Header>
          <View style={styles.explanatoryTextContainer}>
            <Text style={styles.explanatoryText}>
              {this.state.isConfirmation
                ? "Just to make sure it's correct"
                : "This PIN will be used to access your wallet. If you forget it, you won't be able to access your VTH."}
            </Text>
          </View>

          <PinIndicator length={pinCode.length} />
          <PinKeyboard
            onBackPress={this.onBackPress}
            onKeyPress={this.onKeyPress}
            showBackButton={pinCode.length > 0}
          />
        </SafeAreaView>
			</LinearGradient>
		);
  }
}

export default CreateWallet;
