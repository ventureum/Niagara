import React, { Component } from 'react'
import Profile from '../../stories/screens/Profile'
import { connect } from 'react-redux'
import walletUtils from '../../utils/wallet'
import {
  fetchProfile
} from './actions'

class ProfileContainer extends Component {
  constructor (props) {
    super(props)
    const avatar = walletUtils.getAvatar()
    this.state = ({ avatar })
  }

  componentWillMount () {
    this.props.fetchProfile()
  }

  render () {
    return (
      <Profile
        navigation={this.props.navigation}
        avatar={this.state.avatar}
        profile={this.props.profile}
        fetchProfile={this.props.fetchProfile}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  profile: state.profileReducer.profile
})

const mapDispatchToProps = (dispatch) => ({
  fetchProfile: () => dispatch(fetchProfile())
})

ProfileContainer.defaultProps = {
  profile: {},
  fetchProfile: () => {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)
