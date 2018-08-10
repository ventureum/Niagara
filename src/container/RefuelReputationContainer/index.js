import React, { Component } from 'react'
import { connect } from 'react-redux'
import walletUtils from '../../utils/wallet'
import { refuelReputation } from '../ProfileContainer/actions'
import RefuelReputation from '../../stories/screens/RefuelReputation'

class RefuelReputationContainer extends Component {
  constructor (props) {
    super(props)
    const avatar = walletUtils.getAvatar()
    this.state = ({ avatar })
  }
  render () {
    const refreshProfile = this.props.navigation.getParam('refreshProfile', () => {})
    return (
      <RefuelReputation
        navigation={this.props.navigation}
        avatar={this.state.avatar}
        reputation={this.props.reputation}
        refuelReputation={this.props.refuelReputation}
        refreshProfile={refreshProfile}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  reputation: state.profileReducer.reputation
})

const mapDispatchToProps = (dispatch) => ({
  refuelReputation: (reputations, refreshProfile) => dispatch(refuelReputation(reputations, refreshProfile))
})

export default connect(mapStateToProps, mapDispatchToProps)(RefuelReputationContainer)
