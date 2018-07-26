function addToken (tokenSymbol, tokenAddr) {
  return {
    type: 'ADD_TOKEN',
    payload: {
      symbol: tokenSymbol,
      address: tokenAddr
    }
  }
}

function removeToken (tokenSymbol, tokenAddr) {
  return {
    type: 'REMOVE_TOKEN',
    payload: {
      symbol: tokenSymbol,
      address: tokenAddr
    }
  }
}

export { addToken, removeToken }
