// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import SendAndReceive from '../../stories/screens/SendAndReceive'
import WalletUtils from '../../utils/wallet.js'

class SendAndReceiveContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      web3: WalletUtils.getWeb3Instance()
    }
  }

  render () {
    const { navigation } = this.props
    const tokenIdx = navigation.getParam('tokenIdx', null)

    return <SendAndReceive navigation={this.props.navigation}
      loading={this.props.loading}
      token={this.props.tokens[tokenIdx]}
      tokenIdx={tokenIdx}
      walletAddress={this.state.web3.eth.defaultAccount} />
  }
}

const mapStateToProps = state => ({
  tokens: state.assetsReducer.tokens,
  loading: state.assetsReducer.loading
})

export default connect(mapStateToProps)(SendAndReceiveContainer)
