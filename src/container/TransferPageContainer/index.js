import React, { Component } from 'react'
import { connect } from 'react-redux'
import Transfer from '../../stories/screens/Transfer'
import { setNextRedeem, getNextRedeem, getRedeemHistory } from '../../actions'
import { createLoadingSelector, createErrorSelector } from '../../selectors'

class TransferPageContainer extends Component {
  componentDidMount () {
    this.getData()
  }

  getData = () => {
    this.props.getNextRedeem()
    this.props.getRedeemHistory()
  }

  render () {
    return (
      <Transfer
        navigation={this.props.navigation}
        setNextRedeem={this.props.setNextRedeem}
        getRedeemHistory={this.props.getRedeemHistory}
        transfer={this.props.transfer}
        actionsPending={this.props.actionsPending}
        error={this.props.error}
        getData={this.getData}
      />
    )
  }
}

const redeemLoadingSelector = createLoadingSelector(['GET_NEXT_REDEEM', 'SET_NEXT_REDEEM'])
const getRedeemHistoryLoadingSelector = createLoadingSelector(['GET_REDEEM_HISTORY'])
const errorSelector = createErrorSelector(['SET_NEXT_REDEEM', 'GET_NEXT_REDEEM', 'SET_NEXT_REDEEM'])

const mapDispatchToProps = (dispatch) => ({
  setNextRedeem: (milestonePoints, callback) => dispatch(setNextRedeem(milestonePoints, callback)),
  getNextRedeem: () => dispatch(getNextRedeem()),
  getRedeemHistory: () => dispatch(getRedeemHistory())
})

const mapStateToProps = (state) => ({
  transfer: state.profileReducer.transfer,
  actionsPending: {
    redeemLoading: redeemLoadingSelector(state),
    reemHistoryLoading: getRedeemHistoryLoadingSelector(state)
  },
  error: errorSelector(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(TransferPageContainer)
