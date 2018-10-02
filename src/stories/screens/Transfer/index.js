import React, { Component } from 'react'
import { Container, Header, Left, Right, Button, Icon, Body, Title, Card } from 'native-base'
import { View, Text, ScrollView, Switch, Platform, Modal, TextInput, TouchableOpacity } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'
import styles from './styles'

export default class Transfer extends Component {
  state = ({
    autoTransfer: false,
    showModifyDialog: false,
    transferAmount: null
  })

  renderModifyModal = () => {
    return (
      <Modal
        animationType={'slide'}
        transparent
        visible={this.state.showModifyDialog}
        onRequestClose={
          () => { }
        }
      >
        <View style={styles.modelView}>
          <View style={styles.modalBackground} >
            <Text>lala</Text>
          </View>
          <View style={styles.modelMessage}>
            <View style={styles.modelHeaderContainer}>
              <Text style={styles.assetText}>Modify Transfer Amount</Text>
            </View>
            <View>
              <Text style={{
                ...styles.assetSubText,
                marginVertical: ventureum.basicPadding * 2
              }}>
                Please set a transfer amount that is lower than your current Milestone Points.
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: ventureum.borderColor,
                  padding: ventureum.basicPadding + 4
                }}
                autoFocus
                placeholder='New Amount'
                keyboardType='numeric'
                onChangeText={(amount) => {
                  this.setState({ transferAmount: amount })
                }}
                value={this.state.transferAmount}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={styles.modalFooter}>
              <Button
                transparent
                onPress={() => {
                  this.setState({ showModifyDialog: false })
                }}
                style={{ marginRight: ventureum.basicPadding * 2 }}
              >
                <Text style={{ color: ventureum.subTextOnPrimary }}>CANCEL</Text>
              </Button>
              <Button
                transparent
                onPress={() => {
                  this.setState({ showModifyDialog: false })
                }}
                style={{ marginLeft: ventureum.basicPadding }}
              >
                <Text style={{ color: ventureum.secondaryColor }}>MODIFY</Text>
              </Button>
            </View>
          </View>
        </View>

      </Modal >
    )
  }

  renderTransferHistory = () => {
    let listItems = []
    for (let i = 0; i < 30; i++) {
      listItems.push(
        <Card key={i}>
          <View style={[
            styles.nextTransferContainer,
            { paddingHorizontal: ventureum.basicPadding * 2 }
          ]}>
            <View style={styles.assetView}>
              <Text style={styles.assetText}>10,000</Text>
              <Text style={styles.assetSubText}>MSP</Text>
            </View>
            <View style={styles.assetView} >
              <Icon name='arrow-right' type='Feather' style={{ color: ventureum.unClickable }} />
              <Text style={styles.assetSubText}>Sep 4</Text>
            </View>
            <View style={styles.assetView}>
              <Text style={styles.assetText}>17.49</Text>
              <Text style={styles.assetSubText}>VTX</Text>
            </View>
          </View>
        </Card>
      )
    }
    return listItems
  }

  render () {
    const { autoTransfer } = this.state
    return (
      <Container>
        <Header style={{ paddingBottom: null, borderBottomWidth: null }}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-small-left' type='Entypo' />
            </Button>
          </Left>
          <Body>
            <Title>Transfer</Title>
          </Body>
          <Right />
        </Header >
        <ScrollView contentContainerStyle={styles.content}>
          <Card >
            <View style={styles.info}>
              <View style={styles.nextTransferContainer}>
                <View style={styles.assetView}>
                  <Text style={styles.assetText}>10,000</Text>
                  <Text style={styles.assetSubText}>MSP</Text>
                </View>
                <View style={styles.assetView} >
                  <Icon name='arrow-right' type='Feather' style={{ color: ventureum.lightSecondaryColor }} />
                  <Text style={styles.assetSubText}>Sep 4</Text>
                </View>
                <View style={styles.assetView}>
                  <Text style={styles.assetText}>17.49</Text>
                  <Text style={styles.assetSubText}>VTX</Text>
                </View>
              </View>

              <View>
                <TouchableOpacity
                  style={styles.descriptionContainer}
                  onPress={() => {
                    this.setState({ detailOpened: !this.state.detailOpened })
                  }}
                >
                  <Text style={{ ...styles.assetSubText, width: '70%' }}>
                    The next transfer is scheduled on September 4, 2018, 23:59pm
                  </Text>
                  <Icon
                    type='Entypo'
                    name={
                      this.state.detailOpened
                        ? 'chevron-small-up'
                        : 'chevron-small-down'
                    }
                    style={{ color: ventureum.subTextOnPrimary }}
                  />
                </TouchableOpacity>
                {this.state.detailOpened
                  ? <View style={styles.detailContainer} >
                    <View style={styles.firstDetailContainer}>
                      <View>
                        <Text style={styles.detailItemTitle}>Enrolled Milstone Points</Text>
                        <Text style={styles.detailItemValue}>482,852</Text>
                      </View>
                      <View>
                        <Text style={styles.detailItemTitle}>VTX Pool</Text>
                        <Text style={{
                          ...styles.detailItemValue,
                          alignSelf: 'flex-end'
                        }}>1,024</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={styles.detailItemTitle}>Estimated Rate</Text>
                      <Text style={styles.detailItemValue}>100 MSP = 0.1749 VTX</Text>
                    </View>
                  </View>
                  : null
                }
              </View>
              <View style={styles.footer}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>Auto-transfer</Text>
                  <Switch
                    onTintColor={ventureum.lightSecondaryColor}
                    thumbTintColor={
                      autoTransfer
                        ? ventureum.secondaryColor
                        : ventureum.subTextOnPrimary
                    }
                    value={autoTransfer}
                    onValueChange={() => {
                      this.setState({ autoTransfer: !autoTransfer })
                    }}
                    style={{
                      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                      marginLeft: ventureum.basicPadding,
                      marginTop: Platform.OS === 'iOS' ? 0 : 3
                    }}
                  />
                </View>
                {
                  autoTransfer
                    ? <Button transparent onPress={() => {
                      this.setState({ showModifyDialog: !this.state.showModifyDialog })
                    }}>
                      <Text style={{ color: ventureum.secondaryColor }}>Modify</Text>
                    </Button>
                    : null
                }
              </View>
            </View>
          </Card>
          {this.renderTransferHistory()}
        </ScrollView>
        {this.renderModifyModal()}
      </Container>
    )
  }
}
