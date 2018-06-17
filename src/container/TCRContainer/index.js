// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import TCR from '../../stories/screens/TCR'
import datas from './data'
import { fetchList } from './actions'
import tcr from '../../services/tcr'
export interface Props {
  navigation: any,
  fetchList: Function,
  data: Object,
}
export interface State {}
class TCRContainer extends React.Component<Props, State> {
  async componentDidMount () {
    if (!tcr.tcr) {
      await tcr.init()
    }
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
    return <TCR navigation={this.props.navigation} list={this.props.data} />
  }
}

function bindAction (dispatch) {
  return {
    fetchList: url => dispatch(fetchList(url))
  }
}

const mapStateToProps = state => ({
  data: state.tcrReducer.list,
  isLoading: state.tcrReducer.isLoading
})
export default connect(mapStateToProps, bindAction)(TCRContainer)
