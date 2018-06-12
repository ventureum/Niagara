// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import PinCode from '../../stories/screens/PinCode'
export interface Props {
  navigation: any,
  pinCode: string
}
export interface State {}
class PinCodeContainer extends React.Component<Props, State> {
  render () {
    return <PinCode navigation={this.props.navigation} pinCode={this.props.pinCode} />
  }
}

const mapStateToProps = state => ({
  pinCode: state.walletReducer.pinCode
})
export default connect(mapStateToProps)(PinCodeContainer)
