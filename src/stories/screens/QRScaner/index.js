import React, { Component } from 'react'
import { Header, Body, Title, Left, Button, Icon } from 'native-base'
import { SafeAreaView, StyleSheet } from 'react-native'
import { RNCamera } from 'react-native-camera'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    marginTop: 15
  }
})

export default class QRScaner extends Component {
  onBarCodeRead = (e) => {
    this.props.navigation.state.params.returnData(e.data)
    this.props.navigation.goBack()
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Scan QR code</Title>
          </Body>
        </Header>
        <RNCamera onBarCodeRead={this.onBarCodeRead} style={styles.preview} />
      </SafeAreaView>
    )
  }
}
