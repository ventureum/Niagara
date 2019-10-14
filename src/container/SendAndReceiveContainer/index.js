// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import SendAndReceive from '../../stories/screens/SendAndReceive'
import WalletUtils from '../../utils/wallet.js'
import { refreshLogs } from '../../actions'

const BLOCKS_IN_THREE_MONTH = 518400
const NUMBER_OF_TX_TO_FETCH = 20

class SendAndReceiveContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      web3: WalletUtils.getWeb3Instance()
    }
  }

  componentWillMount () {
    this.getLogs()
  }

  getLogs = async () => {
    const tokenIdx = this.props.navigation.getParam('tokenIdx', null)
    const { web3 } = this.state
    const fromBlock = await web3.eth.getBlockNumber() - BLOCKS_IN_THREE_MONTH
    const tokenAddr = this.props.tokens[tokenIdx].address
    const addr = web3.eth.defaultAccount
    let url
    if (tokenAddr === '0x0000000000000000000000000000000000000000') {
      url = `http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=${addr}&startblock=${fromBlock}&sort=desc`
    } else {
      url = `http://api-rinkeby.etherscan.io/api?module=account&action=tokentx&contractaddress=${tokenAddr}&address=${addr}&page=1&offset=${NUMBER_OF_TX_TO_FETCH}&startblock=${fromBlock}&sort=desc`
    }
    this.props.refreshLogs(tokenIdx, url)
  }

  render () {
    const { navigation } = this.props
    const tokenIdx = navigation.getParam('tokenIdx', null)
    return <SendAndReceive navigation={this.props.navigation}
      loading={this.props.loading}
      token={this.props.tokens[tokenIdx]}
      tokenIdx={tokenIdx}
      address={this.state.web3.eth.defaultAccount}
      getLogs={this.getLogs}
    />
  }
}

const mapStateToProps = state => ({
  tokens: state.assetsReducer.tokens,
  loading: state.assetsReducer.loading
})

const mapDispatchToProps = (dispatch) => ({
  refreshLogs: (tokenIdx, url) => dispatch(refreshLogs(tokenIdx, url))
})

export default connect(mapStateToProps, mapDispatchToProps)(SendAndReceiveContainer)
