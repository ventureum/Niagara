import * as React from "react";
import { Platform, SafeAreaView, Vibration } from 'react-native';
import { RNCamera } from 'react-native-camera';
import PropTypes from 'prop-types';
import { Header, Left, Button, Icon, Body, Right, Title } from 'native-base';

import styles from "./styles";
export interface Props {
  navigation: any;
}

class Camera extends React.Component<Props, State> {
  state = {
    scannedText: '',
  };

  onBarCodeRead = e => {
    if (!this.state.scannedText) {
      this.setState(
        {
          scannedText: e.data,
        },
        () => {
          if (Platform.OS === 'ios') {
            Vibration.vibrate(500, false);
          } else {
            Vibration.vibrate([0, 500], false);
          }
          this.props.navigation.state.params.onBarCodeRead(
            this.state.scannedText,
          );
          this.props.navigation.goBack();
        },
      );
    }
  };

  render() {
  	return (
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
            <Title style={styles.title}>Scan QR code</Title>
          </Body>
          <Right />
        </Header>
        <RNCamera onBarCodeRead={this.onBarCodeRead} style={styles.preview} />
      </SafeAreaView>
		);
  }
}

export default Camera;
