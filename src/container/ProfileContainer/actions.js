import * as forum from '../../services/forum'
import { shake128 } from 'js-sha3'

function _fetchProfile (actor) {
  return {
    type: 'FETCH_PROFILE',
    payload: forum.fetchProfile(actor)
  }
}
function fetchProfile () {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_fetchProfile(actor))
  }
}

function _refuel (userAddress, reputations, refreshProfile) {
  return {
    type: 'REFUEL',
    payload: forum.refuel(userAddress, reputations, refreshProfile)
  }
}

function refuel (reputations, refreshProfile) {
  return (dispatch, getState) => {
    const userAddress = getState().walletReducer.walletAddress
    dispatch(_refuel(userAddress, reputations, refreshProfile))
  }
}

function _registerUser (UUID, userName, telegramId, getUserData) {
  return {
    type: 'REGISTER_USER',
    payload: forum.registerUser(UUID, userName, telegramId, getUserData)
  }
}

function registerUser (idRoot, userName, telegramId) {
  const shakeHash = shake128(String(idRoot), 128)
  const hashBytes = Buffer.from(shakeHash, 'hex')
  const uuidParse = require('uuid-parse')
  const UUID = uuidParse.unparse(hashBytes)
  return (dispatch, getState) => {
    dispatch(setActor(UUID))
    dispatch(_registerUser(
      UUID,
      userName,
      String(telegramId),
      () => {
        dispatch(_fetchProfile(UUID))
      }
    ))
  }
}

function setActor (actor) {
  return {
    type: 'SET_ACTOR',
    payload: actor
  }
}

export { fetchProfile, refuel, registerUser }
