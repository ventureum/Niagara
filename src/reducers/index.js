import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import tcrReducer from '../container/TCRContainer/reducer'
import walletReducer from '../container/CreateWalletContainer/reducer'

export default combineReducers({
  form: formReducer,
  tcrReducer,
  walletReducer
})
