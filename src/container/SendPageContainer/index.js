import React, { Component } from 'react'
import { Container } from 'native-base'
import SendPage from '../../stories/screens/SendPage'
import WalletUtils from '../../utils/wallet.js'
import { connect } from 'react-redux'

class SendPageContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      tokenIdx: this.props.navigation.getParam('tokenIdx')
    }
  }

  render () {
    const { tokens } = this.props;
    return (
      <Container>
        <SendPage navigation={this.props.navigation} 
        tokenIdx={this.state.tokenIdx}
        address={tokens[this.state.tokenIdx].address}
        symbol={tokens[this.state.tokenIdx].symbol}
        decimals={tokens[this.state.tokenIdx].decimals}
        balance={tokens[this.state.tokenIdx].balance}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  tokens: state.assetsReducer.tokens
})

export default connect(mapStateToProps)(SendPageContainer)
