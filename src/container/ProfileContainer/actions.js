import * as forum from '../../services/forum'

function _updateReputation (userAddress) {
  return {
    type: 'UPDATE_REPUTATION',
    payload: forum.getReputation(userAddress)
  }
}
function updateReputation () {
  return (dispatch, getState) => {
    const userAddress = getState().walletReducer.walletAddress
    dispatch(_updateReputation(userAddress))
  }
}

function _refuelReputation (userAddress, reputations, refreshProfile) {
  return {
    type: 'REFUEL_REPUTATION',
    payload: forum.refuelReputation(userAddress, reputations, refreshProfile)
  }
}

function refuelReputation (reputations, refreshProfile) {
  return (dispatch, getState) => {
    const userAddress = getState().walletReducer.walletAddress
    dispatch(_refuelReputation(userAddress, reputations, refreshProfile))
  }
}

export { updateReputation, refuelReputation }
