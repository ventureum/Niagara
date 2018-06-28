import React, { Component } from 'react'
import { connect } from 'react-redux'
import Discover from '../../stories/screens/Discover'
import { setTokens, refreshPosts, getMorePosts } from './actions'
import WalletUtils from '../../utils/wallet.js'
import Identicon from 'identicon.js'

class DiscoverContainer extends Component {
  constructor (props) {
    super(props)
    this.props.refreshPosts()
  }

  render () {
    const web3 = WalletUtils.getWeb3Instance()
    let identiconData = new Identicon(web3.eth.defaultAccount, 64).toString()
    let identiconBase64 = 'data:image/png;base64,' + identiconData
    const userAddress = web3.eth.defaultAccount
    return (
      <Discover navigation={this.props.navigation}
        posts={this.props.posts}
        refreshPosts={this.props.refreshPosts}
        getMorePosts={this.props.getMorePosts}
        identiconBase64={identiconBase64}
        userAddress={userAddress}
      />
    )
  }
}

const mapStateToProps = state => ({
  publicToken: state.discoverReducer.publicToken,
  userToken: state.discoverReducer.userToken,
  timelineToken: state.discoverReducer.timelineToken,
  posts: state.discoverReducer.posts
})

const mapDispatchToProps = (dispatch) => ({
  setTokens: (publicToken, userToken, timelineToken) => dispatch(setTokens(publicToken, userToken, timelineToken)),
  refreshPosts: () => dispatch(refreshPosts()),
  getMorePosts: () => dispatch(getMorePosts())
})

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverContainer)
