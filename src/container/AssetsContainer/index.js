// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Assets from '../../stories/screens/Assets'
import WalletUtils from '../../utils/wallet.js'
import { refreshTokens, initTokens } from './actions'

class AssetsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      web3: WalletUtils.getWeb3Instance()
    }
  }

  componentWillMount () {
    this.props.initTokens()
    this.props.refreshTokens()
  }

  render () {
    return <Assets navigation={this.props.navigation}
      loading={this.props.loading}
      tokens={this.props.tokens}
      totalVal={0}
      walletAddress={this.state.web3.eth.defaultAccount}
      refreshTokens={this.props.refreshTokens}
    />
  }
}

const mapStateToProps = state => ({
  tokens: state.assetsReducer.tokens,
  loading: state.assetsReducer.loading
})

const mapDispatchToProps = (dispatch) => ({
  refreshTokens: () => dispatch(refreshTokens()),
  initTokens: () => dispatch(initTokens())
})

export default connect(mapStateToProps, mapDispatchToProps)(AssetsContainer)
