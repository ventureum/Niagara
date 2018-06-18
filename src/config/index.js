import WalletUtils from '../utils/wallet'
import TCRRegistry from '../contracts/Registry'
import Token from '../contracts/VetXToken'

var contracts = {
  TCRRegistry,
  Token
}

export const getToken = async (account, provider) => {
  const tokenArtifact = contracts['Token']
  const web3 = WalletUtils.getWeb3Instance()
  const networkId = await web3.eth.net.getId()
  const Token = new web3.eth.Contract(tokenArtifact.abi, tokenArtifact.networks[networkId].address, {from: account, gas: 500000})

  return Token
}

export const getTCR = async (account, provider) => {
  const registryArtifact = contracts['TCRRegistry']
  const web3 = WalletUtils.getWeb3Instance()
  const networkId = await web3.eth.net.getId()
  const Registry = new web3.eth.Contract(registryArtifact.abi, registryArtifact.networks[networkId].address, {from: account, gas: 500000})

  return Registry
}
