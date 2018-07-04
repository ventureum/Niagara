import React, { Component } from 'react'
import { connect } from 'react-redux'
import Discover from '../../stories/screens/Discover'
import { refreshPosts, getMorePosts } from './actions'

class DiscoverContainer extends Component {
  constructor (props) {
    super(props)
    this.props.refreshPosts()
  }

  render () {
    return (
      <Discover navigation={this.props.navigation}
        posts={this.props.posts}
        refreshPosts={this.props.refreshPosts}
        getMorePosts={this.props.getMorePosts}
        loading={this.props.loading}
      />
    )
  }
}

const mapStateToProps = state => ({
  posts: state.discoverReducer.posts,
  loading: state.discoverReducer.loading
})

const mapDispatchToProps = (dispatch) => ({
  refreshPosts: () => dispatch(refreshPosts()),
  getMorePosts: () => dispatch(getMorePosts())
})

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverContainer)
