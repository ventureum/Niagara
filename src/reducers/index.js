import { combineReducers } from 'redux'

import tcrReducer from './tcrReducer'
import walletReducer from './walletReducer'
import assetsReducer from './assetReducer'
import transactionReducer from './transactionReducer'
import networkReducer from './networkReducer'
import profileReducer from './profileReducer'
import chatPageReducer from '../container/ChatPageContainer/reducer'
import forumReducer from './forumReducer'

export default combineReducers({
  tcrReducer,
  walletReducer,
  assetsReducer,
  transactionReducer,
  networkReducer,
  profileReducer,
  chatPageReducer,
  forumReducer
})
