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

function _getRecentVotes (actor) {
  return {
    type: 'GET_RECENT_VOTES',
    payload: forum.getRecentVotes(actor)
  }
}

function getRecentVotes () {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_getRecentVotes(actor))
  }
}

function _getRecentComments (actor) {
  return {
    type: 'GET_RECENT_COMMENTS',
    payload: forum.getRecentComments(actor)
  }
}

function getRecentComments () {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_getRecentComments(actor))
  }
}

function _getRecentPosts (actor) {
  return {
    type: 'GET_RECENT_POSTS',
    payload: forum.getRecentPosts(actor)
  }
}

function getRecentPosts () {
  return (dispatch, getState) => {
    const actor = getState().profileReducer.profile.actor
    dispatch(_getRecentPosts(actor))
  }
}
export {
  fetchProfile,
  refuel,
  registerUser,
  getRecentVotes,
  getRecentComments,
  getRecentPosts
}
