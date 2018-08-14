import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import tcrReducer from '../container/TCRContainer/reducer'
import walletReducer from '../container/CreateWalletContainer/reducer'
import assetsReducer from '../container/AssetsContainer/reducer'
import discoverReducer from '../container/DiscoverContainer/reducer'
import transactionReducer from '../container/TransactionContainer/reducer'
import sendPageReducer from '../container/SendPageContainer/reducer'
import network from '../container/NetworkContainer/reducer'
import postDetailReducer from '../container/PostDetailContainer/reducer'
import profileReducer from '../container/ProfileContainer/reducer'

export default combineReducers({
  form: formReducer,
  tcrReducer,
  walletReducer,
  assetsReducer,
  discoverReducer,
  transactionReducer,
  sendPageReducer,
  network,
  postDetailReducer,
  profileReducer
})
