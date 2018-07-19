// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import CreateWallet from '../../stories/screens/CreateWallet'
import { setPinCode, setWalletAddress, setPrivateKey } from './actions'

export interface Props {
  navigation: any,
  setPinCode: Function,
  setWalletAddress: Function,
  setPrivateKey: Function
}
export interface State {}
class CreateWalletContainer extends React.Component<Props, State> {
  render () {
    return <CreateWallet navigation={this.props.navigation} setPinCode={this.props.setPinCode} setWalletAddress={this.props.setWalletAddress} setPrivateKey={this.props.setPrivateKey} />
  }
}

function bindAction (dispatch) {
  return {
    setPinCode: pinCode => dispatch(setPinCode(pinCode)),
    setWalletAddress: address => dispatch(setWalletAddress(address)),
    setPrivateKey: privKey => dispatch(setPrivateKey(privKey))
  }
}

export default connect(null, bindAction)(CreateWalletContainer)
