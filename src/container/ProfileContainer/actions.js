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

function _refuel (actor, reputations, refreshProfile) {
  return {
    type: 'REFUEL',
    payload: forum.refuel(actor, reputations, refreshProfile)
  }
}

function refuel (reputations, refreshProfile) {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_refuel(actor, reputations, refreshProfile))
  }
}

function _registerUser (actor, username, telegramId, getUserData) {
  return {
    type: 'REGISTER_USER',
    payload: forum.registerUser(actor, username, telegramId, getUserData)
  }
}

function registerUser (idRoot, username, telegramId) {
  const shakeHash = shake128(String(idRoot), 128)
  const hashBytes = Buffer.from(shakeHash, 'hex')
  const uuidParse = require('uuid-parse')
  const actor = uuidParse.unparse(hashBytes)
  return (dispatch, getState) => {
    dispatch(setActor(actor))
    dispatch(_registerUser(
      actor,
      username,
      String(telegramId),
      () => {
        dispatch(_fetchProfile(actor))
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
