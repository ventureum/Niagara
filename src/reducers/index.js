import { combineReducers } from 'redux'

import tcrReducer from './tcrReducer'
import walletReducer from './walletReducer'
import assetsReducer from './assetReducer'
import transactionReducer from './transactionReducer'
import network from './networkReducer'
import profileReducer from './profileReducer'
import chatPageReducer from '../container/ChatPageContainer/reducer'
import forumReducer from './forumReducer'

export default combineReducers({
  tcrReducer,
  walletReducer,
  assetsReducer,
  transactionReducer,
  network,
  profileReducer,
  chatPageReducer,
  forumReducer
})
