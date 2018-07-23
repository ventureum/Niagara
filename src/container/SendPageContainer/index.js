import React, { Component } from 'react'
import { Container } from 'native-base'
import SendPage from '../../stories/screens/SendPage'
import { connect } from 'react-redux'
import {sendTransaction} from './actions'

class SendPageContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tokenIdx: this.props.navigation.getParam('tokenIdx')
    }
  }

  render () {
    const { tokens } = this.props
    return (
      <Container>
        <SendPage navigation={this.props.navigation}
          tokenIdx={this.state.tokenIdx}
          tokenAddress={tokens[this.state.tokenIdx].address}
          tokenSymbol={tokens[this.state.tokenIdx].symbol}
          tokenDecimals={tokens[this.state.tokenIdx].decimals}
          tokenBalance={tokens[this.state.tokenIdx].balance}
          sendTransaction={this.props.sendTransaction}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  tokens: state.assetsReducer.tokens,
  loading: state.sendPageReducer.loading
})
const mapDispatchToProps = (dispatch) => ({
  sendTransaction: (receiverAddress, tokenSymbol, tokenAddress, amount) => dispatch(sendTransaction(receiverAddress, tokenSymbol, tokenAddress, amount))
})

export default connect(mapStateToProps, mapDispatchToProps)(SendPageContainer)
