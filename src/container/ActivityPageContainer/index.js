import React, { Component } from 'react'
import { connect } from 'react-redux'
import Activity from '../../stories/screens/Activity'
import {
  getRecentComments,
  getRecentPosts,
  getRecentVotes
} from '../../actions'
class ActivityPageContainer extends Component {
  componentWillMount () {
    this.props.getRecentComments()
    this.props.getRecentPosts()
    this.props.getRecentVotes()
  }

  render () {
    return (
      <Activity
        navigation={this.props.navigation}
        getRecentVotes={this.props.getRecentVotes}
        getRecentPosts={this.props.getRecentPosts}
        getRecentComments={this.props.getRecentComments}
        recentPosts={this.props.recentPosts}
        recentComments={this.props.recentComments}
        recentVotes={this.props.recentVotes}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  recentPosts: state.profileReducer.recentPosts,
  recentComments: state.profileReducer.recentComments,
  recentVotes: state.profileReducer.recentVotes
})

const mapDispatchToProps = (dispatch) => ({
  getRecentVotes: () => dispatch(getRecentVotes()),
  getRecentPosts: () => dispatch(getRecentPosts()),
  getRecentComments: () => dispatch(getRecentComments())
})

ActivityPageContainer.defaultProps = {
  recentPosts: [],
  recentComments: [],
  recentVotes: []
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityPageContainer)
