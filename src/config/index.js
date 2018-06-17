import contract from 'truffle-contract'
import WalletUtils from '../utils/wallet'
import TCRRegistry from '../contracts/Registry'

var contracts = {
  TCRRegistry
}

var createErrorHandler = function (name) {
  return function (err) {
    console.error(err)
    throw new Error('contract ' + name + ' cannot be found, make sure you are using the correct network.')
  }
}

export const getTCR = async (account, provider) => {
  const registryArtifact = contracts['TCRRegistry']
  const Registry = contract(registryArtifact)
  Registry.defaults({from: account})
  Registry.setProvider(provider || WalletUtils.getWeb3HTTPProvider())

  // truffle-contract has bug with local httpprovider
  // fix according to https://github.com/trufflesuite/truffle-contract/issues/57
  if (typeof Registry.currentProvider.sendAsync !== 'function') {
    Registry.currentProvider.sendAsync = function () {
      return Registry.currentProvider.send.apply(
        Registry.currentProvider, arguments
      )
    }
  }

  return Registry.deployed().catch(createErrorHandler('TCR'))
}
