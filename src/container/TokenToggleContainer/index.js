// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import TokenToggle from '../../stories/screens/TokenToggle'
import { addToken, removeToken } from '../../actions'

class TokenToggleContainer extends React.Component {
  render () {
    return (
      <TokenToggle
        navigation={this.props.navigation}
        tokens={this.props.tokens.slice(1)} // ignore ETH
        addToken={this.props.addToken}
        removeToken={this.props.removeToken}
      />
    )
  }
}

const mapStateToProps = state => ({
  tokens: state.assetsReducer.tokens
})

const mapDispatchToProps = (dispatch) => ({
  addToken: (tokenSymbol, tokenAddr) => dispatch(addToken(tokenSymbol, tokenAddr)),
  removeToken: (tokenSymbol, tokenAddr) => dispatch(removeToken(tokenSymbol, tokenAddr))
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenToggleContainer)
