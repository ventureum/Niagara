import * as React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Content, Header, Body, Title, Button, Text, View, Icon, Left, Right, Footer } from "native-base";
import LinearGradient from 'react-native-linear-gradient';
import EthereumJsWallet from 'ethereumjs-wallet';

import styles from "./styles";
import cameraIcon from './images/camera.png';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';


export interface Props {
  navigation: any;
}

class RecoverWallet extends React.Component<Props, State> {
  state = {
    privateKey: '',
    wallet: null
  };

  onBarCodeRead = privateKey => {
    this.setState({
      privateKey,
    });
  };

  onCameraPress = () => {
    this.props.navigation.navigate('Camera', {
      onBarCodeRead: this.onBarCodeRead,
    });
  };

  importWallet = async () => {
    try {
      this.recoverWallet(this.state.privateKey);
    } catch (error) {
      Alert.alert(
        'Private key',
        'Your private key is invalid. Please try again.',
      );
      return;
    }
    
    setTimeout(() => {
      Alert.alert(
        'Success',
        "Wallet recovered! Address: " + this.state.wallet.getAddressString(),
      );
      this.props.navigation.navigate('Home');
    }, 0)
    
    // this.props.navigation.navigate('Wallet');
  };

  recoverWallet (privateKey) {
    const wallet = EthereumJsWallet.fromPrivateKey(
      Buffer.from(privateKey, 'hex'),
    );
    this.props.setWalletAddress(wallet.getAddressString());
    this.props.setPrivateKey(wallet.getPrivateKey().toString('hex'));
    this.setState({
      wallet
    })
  }

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
              <Title style={styles.title}>Recover wallet</Title>
            </Body>
            <Right />
          </Header>
          <View>
            <View style={styles.formElement}>
              <Text style={styles.formLabel}>Private key</Text>
              <View style={styles.formInputRow}>
                <TextInput
                  autoCorrect={false}
                  onChangeText={privateKey => this.setState({ privateKey })}
                  placeholder="0x..."
                  placeholderTextColor="#9d9d9d"
                  returnKeyType="done"
                  selectionColor="#4D00FF"
                  style={styles.formInput}
                  underlineColorAndroid="transparent"
                  value={this.state.privateKey}
                />
                <TouchableOpacity onPress={this.onCameraPress}>
                  <Image source={cameraIcon} style={styles.cameraIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button block
              onPress={this.importWallet}
              disabled={this.state.privateKey === ''}
            >
              <Text>Import wallet</Text>
            </Button>
          </View>
        </SafeAreaView>
			</LinearGradient>
		);
  }
}

export default RecoverWallet;
