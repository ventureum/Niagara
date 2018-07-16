import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import tcrReducer from '../container/TCRContainer/reducer'
import walletReducer from '../container/CreateWalletContainer/reducer'
import assetsReducer from '../container/AssetsContainer/reducer'
import discoverReducer from '../container/DiscoverContainer/reducer'
import transactionReducer from '../container/TransactionContainer/reducer'

export default combineReducers({
  form: formReducer,
  tcrReducer,
  walletReducer,
  assetsReducer,
  discoverReducer,
  transactionReducer
})
