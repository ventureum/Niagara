import React, { Component } from 'react'
import { connect } from 'react-redux'
import walletUtils from '../../utils/wallet'
import { refuel } from '../ProfileContainer/actions'
import Refuel from '../../stories/screens/Refuel'

class RefuelContainer extends Component {
  constructor (props) {
    super(props)
    const avatar = walletUtils.getAvatar()
    this.state = ({ avatar })
  }
  render () {
    const refreshProfile = this.props.navigation.getParam('refreshProfile', () => {})
    return (
      <Refuel
        navigation={this.props.navigation}
        avatar={this.state.avatar}
        reputation={this.props.reputation}
        refuel={this.props.refuel}
        refreshProfile={refreshProfile}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  reputation: state.profileReducer.reputation
})

const mapDispatchToProps = (dispatch) => ({
  refuel: (reputations, refreshProfile) => dispatch(refuel(reputations, refreshProfile))
})

export default connect(mapStateToProps, mapDispatchToProps)(RefuelContainer)
