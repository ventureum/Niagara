import React, { Component } from 'react'
import Profile from '../../stories/screens/Profile'
import { connect } from 'react-redux'
import walletUtils from '../../utils/wallet'
import {
  fetchProfile,
  getNextRedeem
} from '../../actions'
import { createLoadingSelector, createErrorSelector } from '../../selectors'

class ProfileContainer extends Component {
  constructor (props) {
    super(props)
    const avatar = walletUtils.getAvatar()
    this.state = ({ avatar })
  }

  componentDidMount () {
    this.getData()
  }

  getData = () => {
    this.props.fetchProfile()
    this.props.getNextRedeem()
  }

  render () {
    return (
      <Profile
        navigation={this.props.navigation}
        avatar={this.state.avatar}
        profile={this.props.profile}
        fetchProfile={this.props.fetchProfile}
        transfer={this.props.transfer}
        getData={this.getData}
        error={this.props.error}
        actionsPending={this.props.actionsPending}
      />
    )
  }
}

const fetchProfileLoadingSelector = createLoadingSelector(['FETCH_PROFILE'])
const getNextRedeemLoadingSelector = createLoadingSelector(['GET_NEXT_REDEEM'])
const errorSelector = createErrorSelector(['FETCH_PROFILE', 'GET_NEXT_REDEEM'])

const mapStateToProps = (state) => ({
  profile: state.profileReducer.profile,
  transfer: state.profileReducer.transfer,
  actionsPending: {
    fetchProfile: fetchProfileLoadingSelector(state),
    getNextRedeem: getNextRedeemLoadingSelector(state)
  },
  error: errorSelector(state)
})

const mapDispatchToProps = (dispatch) => ({
  fetchProfile: () => dispatch(fetchProfile()),
  getNextRedeem: () => dispatch(getNextRedeem())
})

ProfileContainer.defaultProps = {
  profile: {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)
