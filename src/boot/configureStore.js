// @flow
// import { AsyncStorage } from "react-native";
import devTools from 'remote-redux-devtools'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistReducer, persistStore } from 'redux-persist'
import createSensitiveStorage from 'redux-persist-sensitive-storage'
import reducer from '../reducers'

const storage = createSensitiveStorage({
  encrypt: true,
  keychainService: 'vthwallet',
  sharedPreferencesName: 'vthwallet'
})

const persistConfig = {
  key: 'vthwallet',
  version: 1,
  storage
}

var store = null

function configureStore (onCompletion: () => void): any {
  const enhancer = compose(
    applyMiddleware(thunk),
    devTools({
      name: 'nativestarterkit',
      realtime: true
    })
  )

  store = createStore(persistReducer(persistConfig, reducer), enhancer)
  persistStore(store, onCompletion)

  return store
}

export { store, configureStore }
