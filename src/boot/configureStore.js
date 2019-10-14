// @flow
// import { AsyncStorage } from "react-native";
import devTools from 'remote-redux-devtools'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistReducer, persistStore } from 'redux-persist'
import createSensitiveStorage from 'redux-persist-sensitive-storage'
import reducer from '../reducers'
import promiseMiddleware from 'redux-promise-middleware'
import logger from 'redux-logger'

const storage = createSensitiveStorage({
  encrypt: true,
  keychainService: 'Milestone',
  sharedPreferencesName: 'Milestone'
})

const persistConfig = {
  key: 'Milestone',
  version: 1,
  storage,
  blacklist: ['forumReducer']
}

var store = null
var persistor = null
function configureStore (onCompletion: () => void): any {
  const enhancer = compose(
    applyMiddleware(promiseMiddleware(), thunk, logger),
    devTools({
      name: 'nativestarterkit',
      realtime: true
    })
  )

  store = createStore(persistReducer(persistConfig, reducer), enhancer)

  persistor = persistStore(store, null, onCompletion)

  return store
}

export { persistor, store, configureStore }
