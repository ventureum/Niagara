import React, { Component } from 'react'
import { connect } from 'react-redux'
import Transaction from '../../stories/screens/Transaction'
import { newTransaction, updateTransactionStatus } from './actions'

class TransactionContainer extends Component {
  render () {
    return (
      <Transaction
        navigation={this.props.navigation}
        transactions={this.props.transactions}
        updateTransactionStatus={this.props.updateTransactionStatus}
        loading={this.props.loading}
      />
    )
  }
}
const mapDispatchToProps = (dispatch) => ({
  newTransaction: (txHash) => dispatch(newTransaction(txHash)),
  updateTransactionStatus: () => dispatch(updateTransactionStatus())
})

const mapStateToProps = (state) => ({
  transactions: state.transactionReducer.transactions,
  loading: state.transactionReducer.loading
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionContainer)
