// @flow
import * as React from "react";
import { connect } from "react-redux";
import RecoverWallet from "../../stories/screens/RecoverWallet";
import { setPinCode, setWalletAddress, setPrivateKey } from "../CreateWalletContainer/actions";
export interface Props {
  navigation: any,
  setPinCode: Function,
  setWalletAddress: Function,
  setPrivateKey: Function,
}
export interface State {}
class RecoverWalletContainer extends React.Component<Props, State> {
  render() {
    return <RecoverWallet navigation={this.props.navigation} setPinCode={this.props.setPinCode} setWalletAddress={this.props.setWalletAddress} setPrivateKey={this.props.setPrivateKey} />;
  }
}

function bindAction(dispatch) {
  return {
    setPinCode: pinCode => dispatch(setPinCode(pinCode)),
    setWalletAddress: address => dispatch(setWalletAddress(address)),
    setPrivateKey: privKey => dispatch(setPrivateKey(privKey)),
  };
}

export default connect(null, bindAction)(RecoverWalletContainer);