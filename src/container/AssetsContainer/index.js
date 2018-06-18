// @flow
import * as React from "react"
import { connect } from "react-redux"
import Assets from "../../stories/screens/Assets"
import { Text } from 'native-base'
import WalletUtils from '../../utils/wallet.js'

class AssetsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      web3: WalletUtils.getWeb3Instance()
    }
  }

	render() {
		return <Assets navigation={this.props.navigation}
             loading={this.props.loading}
             tokens={this.props.tokens}
             totalVal={0}
             walletAddress={this.state.web3.eth.defaultAccount} />;
	}
}

const mapStateToProps = state => ({
	tokens: state.assetsReducer.tokens,
	loading: state.assetsReducer.loading
});

export default connect(mapStateToProps)(AssetsContainer);
             
