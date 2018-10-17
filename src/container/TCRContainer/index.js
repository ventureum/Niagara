// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import TCR from '../../stories/screens/TCR'
import { fetchList, delisted, whitelisted, voted } from '../../actions'
import tcr from '../../services/tcr'
import { store } from '../../boot/configureStore'
export interface Props {
  navigation: any,
  fetchList: Function,
  data: Object,
  delisted: Function,
  whitelisted: Function,
  voted: Function,
  isLoading: String
}
export interface State {}
class TCRContainer extends React.Component<Props, State> {
  async componentDidMount () {
    if (!tcr.tcr) {
      await tcr.init()
    }
    this.getProjects()
    store.subscribe(() => {
      let state = store.getState()
      if (state.tcrReducer.needUpdate) {
        this.getProjects()
      }
    })
  }

  async getProjects () {
    var pendingList = await tcr.getList('pending')
    var votingList = await tcr.getList('voting')
    var whitelistList = await tcr.getList('whitelist')
    this.props.fetchList({
      pendingList,
      votingList,
      whitelistList
    })
  }

  render () {
    return <TCR loading={this.props.isLoading} refreshProject={this.getProjects.bind(this)} navigation={this.props.navigation} list={this.props.data} delisted={this.props.delisted} whitelisted={this.props.whitelisted} voted={this.props.voted} />
  }
}

function bindAction (dispatch) {
  return {
    fetchList: url => dispatch(fetchList(url)),
    delisted: url => dispatch(delisted(url)),
    whitelisted: url => dispatch(whitelisted(url)),
    voted: url => dispatch(voted(url))
  }
}

const mapStateToProps = state => ({
  data: state.tcrReducer.list,
  isLoading: state.tcrReducer.isLoading
})
export default connect(mapStateToProps, bindAction)(TCRContainer)
