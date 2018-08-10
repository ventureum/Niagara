import React, { Component } from 'react'
import Profile from '../../stories/screens/Profile'
import { connect } from 'react-redux'
import walletUtils from '../../utils/wallet'
import { updateReputation } from './actions'

class ProfileContainer extends Component {
  constructor (props) {
    super(props)
    const avatar = walletUtils.getAvatar()
    this.state = ({ avatar })
  }
  render () {
    return (
      <Profile
        navigation={this.props.navigation}
        avatar={this.state.avatar}
        reputation={this.props.reputation}
        updateReputation={this.props.updateReputation}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  reputation: state.profileReducer.reputation
})

const mapDispatchToProps = (dispatch) => ({
  updateReputation: () => dispatch(updateReputation())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)
