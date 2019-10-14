// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Assets from '../../stories/screens/Assets'
import { refreshTokens } from '../../actions'

class AssetsContainer extends React.Component {
  componentWillMount () {
    this.props.refreshTokens()
  }

  render () {
    return <Assets navigation={this.props.navigation}
      loading={this.props.loading}
      tokens={this.props.tokens}
      totalVal={0}
      address={this.props.address}
      refreshTokens={this.props.refreshTokens}
    />
  }
}

const mapStateToProps = state => ({
  tokens: state.assetsReducer.tokens,
  loading: state.assetsReducer.loading,
  address: state.walletReducer.address
})

const mapDispatchToProps = (dispatch) => ({
  refreshTokens: () => dispatch(refreshTokens())
})

export default connect(mapStateToProps, mapDispatchToProps)(AssetsContainer)
