import React, { Component } from 'react'
import { Header, Left, Right, Button, Icon, Body, Title } from 'native-base'
import { View, Text, Switch, Modal, TextInput, TouchableOpacity, FlatList } from 'react-native'
import ventureum from '../../../theme/variables/ventureum'
import styles from './styles'

export default class Transfer extends Component {
  state = ({
    showBlockDetails: false,
    showModifyDialog: false,
    transferAmount: 0
  })

  renderHeader = () => {
    return (
      <Header style={{ paddingBottom: null, borderBottomWidth: null, paddingLeft: 0 }}>
        <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name='chevron-small-left' type='Entypo' />
          </Button>
        </Left>
        <Body>
          <Title>Redeem</Title>
        </Body>
        <Right />
      </Header >
    )
  }

  renderRedeemSetting = () => {
    return (
      <View style={styles.settingContainer}>
        <Text style={styles.settingTitle} >
          Redeem Settings
        </Text>
        <Text style={styles.settingText}>
          Milestone points will be redeemed for VTX tokens every Sunday night.
        </Text>
        <View style={styles.redeemSettingContainer}>
          <Text style={styles.redeemSettingText}>
            Redeem all MSP by default
          </Text>
          <Switch value={false} />
        </View>
      </View>
    )
  }

  renderModifyModal = () => {
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.state.showModifyDialog}
        onRequestClose={
          () => {
            this.setState({ showModifyDialog: false })
          }
        }
      >
        <View style={styles.modelView}>
          <View style={styles.modalBackground} />
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
                value={String(this.state.transferAmount)}
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

  renderSpacer = (text) => {
    return (
      <View style={styles.spacer}>
        <Text style={styles.spacerText}>{text}</Text>
      </View>
    )
  }

  renderTransfer = (time, MSP, VTX) => {
    return (
      <View style={styles.transferContainer}>
        <View >
          <Text style={styles.timeText}>2018-10-31</Text>
          <Text style={styles.mspText}>{this.state.transferAmount} MSP</Text>
        </View>
        <Icon style={{ color: '#777777' }} name='arrow-right' type='Feather' />
        <Text style={styles.vtxText}>12.24VTX</Text>
      </View>
    )
  }

  renderUpcomingRedeem = () => {
    return (
      <View style={styles.upcomingContainer}>
        {this.renderTransfer()}
        {this.state.showBlockDetails ? <View>
          <View>
            <Text style={styles.blockInfoTitle}>
              Enrolled Milestone Points
            </Text>
            <Text style={styles.blockInfoText}>
              482,852
            </Text>
          </View>
          <View>
            <Text style={styles.blockInfoTitle}>
              Estimated Rate
            </Text>
            <Text style={styles.blockInfoText}>
              100 MSP = 0.1749 VTX
            </Text>
          </View>
          <View>
            <Text style={styles.blockInfoTitle}>
              VTX Pool
            </Text>
            <Text style={styles.blockInfoText}>
              1,024
            </Text>
          </View>
        </View>
          : null
        }
        <View style={styles.upcomingFooter}>
          <TouchableOpacity onPress={() => {
            this.setState({ showBlockDetails: !this.state.showBlockDetails })
          }}>
            <Icon
              name={this.state.showBlockDetails ? 'chevron-up' : 'chevron-down'}
              type='MaterialCommunityIcons'
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: 'center'
            }}
            onPress={() => {
              this.setState({ showModifyDialog: true })
            }}
          >
            <Text style={{
              fontWeight: ventureum.medium,
              fontSize: 16,
              color: ventureum.lightSecondaryColor
            }}>MODIFY</Text>
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  onRenderItem = ({ item, index }) => {
    switch (item.name) {
      case 'Redeem_Settings':
        return this.renderRedeemSetting()
      case 'UpcomingSpacer':
        return this.renderSpacer('Upcoming Redeem (based on estimated rate)')
      case 'UpcomingTransfer':
        return this.renderUpcomingRedeem()
      case 'HistorySpacer':
        return this.renderSpacer('Redeem History')
      default:
        return null
    }
  }

  render () {
    let data = []
    data.push({ name: 'Redeem_Settings', id: '0' })
    data.push({ name: 'UpcomingSpacer', id: '1' })
    data.push({ name: 'UpcomingTransfer', id: '2' })
    data.push({ name: 'HistorySpacer', id: '3' })
    return (
      <View style={styles.fill}>
        <FlatList
          data={data}
          renderItem={this.onRenderItem}
          ref={(ref) => { this.flatListRef = ref }}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
          }}
          ListHeaderComponent={this.renderHeader}
          contentContainerStyle={styles.container}
        />
        {this.renderModifyModal()}
      </View>

    )
  }
}
