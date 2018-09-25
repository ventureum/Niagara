// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Login from '../../stories/screens/Login'
export interface Props {
  navigation: any;
  pinCode: string;
  walletAddress: string;
}
export interface State {}
class LoginContainer extends React.Component<Props, State> {
  render () {
    return <Login navigation={this.props.navigation} />
  }
}

const mapStateToProps = state => ({
  walletAddress: state.walletReducer.walletAddress
})
export default connect(mapStateToProps)(LoginContainer)
