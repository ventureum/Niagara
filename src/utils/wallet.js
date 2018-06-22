import Config from 'react-native-config'
import Web3 from 'web3'
import { store } from '../boot/configureStore.js'

import { ERC20_ABI } from './contracts/ERC20.js'
import TCRRegistry from './contracts/Registry'
import Token from './contracts/VetXToken'

export default class WalletUtils {
  /**
   * Reads an EthereumJSWallet instance from Redux store
   */

  static ERC20 = './abi/ERC20.js'

  static web3;

  static getWallet () {
    const { walletReducer } = store.getState()
    return walletReducer
  }

  static getWeb3HTTPProvider () {
    switch (store.getState().network) {
      case 'ropsten':
        return new Web3.providers.HttpProvider(
          `https://ropsten.infura.io/${Config.INFURA_API_KEY}`
        )
      case 'kovan':
        return new Web3.providers.HttpProvider(
          `https://kovan.infura.io/${Config.INFURA_API_KEY}`
        )
      case 'rinkeby':
        return new Web3.providers.HttpProvider(
          `https://rinkeby.infura.io/${Config.INFURA_API_KEY}`
        )
      case 'mainnet':
        return new Web3.providers.HttpProvider(
          `https://mainnet.infura.io/${Config.INFURA_API_KEY}`
        )
      default:
        return new Web3.providers.HttpProvider(
        `https://rinkeby.infura.io/${Config.INFURA_API_KEY}`

        )
    }
  }
  
  /**
   * Returns a web3 instance with the user's wallet
   */
  static getWeb3Instance () {
    if (!this.web3) {
      const wallet = this.getWallet()

      this.web3 = new Web3(this.getWeb3HTTPProvider())

      this.web3.eth.accounts.wallet.add({
        privateKey: wallet.privateKey,
        address: wallet.walletAddress
      })
      this.web3.eth.defaultAccount = wallet.walletAddress
    }
    return this.web3
  }

  /**
   * Get the user's wallet balance of a given token
   *
   * @param {Object} token
   */
  static getBalance({ address, symbol, decimals }) {
    if (symbol === 'ETH') {
      return this.getEthBalance()
    }

    return this.getERC20Balance(address, decimals);
  }

  /**
   * Get the user's wallet ETH balance
   */
  static getEthBalance () {
    const { walletReducer } = store.getState()

    const _web3 = this.getWeb3Instance()
    return new Promise((resolve, reject) => {
      _web3.eth.getBalance(walletReducer.walletAddress, (error, weiBalance) => {
        if (error) {
          reject(error)
        }

        const balance = weiBalance / Math.pow(10, 18)
        resolve(balance)
      })
    })
  }

  /**
   * Get the user's wallet balance of a specific ERC20 token
   *
   * @param {String} contractAddress
   * @param {Number} decimals
   */
  static getERC20Balance (contractAddress, decimals) {
    const { walletReducer } = store.getState()

    return new Promise((resolve, reject) => {
      const instance = this.getERC20Instance(contractAddress)
      instance.methods.balanceOf(walletReducer.walletAddress).call((error, decimalsBalance) => {
        if (error) {
          reject(error)
        }

        const balance = decimalsBalance / Math.pow(10, decimals)
        resolve(balance)
      })
    })
  }

  /*
    Return a web3 contract object of the ERC20 instance
    @param {String} addressof the ERC20 contract
  */
  static getERC20Instance (address) {
    const _web3 = this.getWeb3Instance()
    return new _web3.eth.Contract(ERC20_ABI, address)
  }

  /*
    Return a web3 contract object of the ERC20 instance
    @param {String} Name of the contract
    @dev Intended to be used only with Ventureum product
  */
  static async getContractInstance (name) {
    const _web3 = this.getWeb3Instance()
    const networkId = await _web3.eth.net.getId()
    const account = this.getWallet().walletAddress

    var artifact
    switch (name) {
      case 'Registry':
        artifact = TCRRegistry
        break
      case 'Token':
        artifact = Token
        break
      default:
        return new Error('Invalid contract name received.')
    }

    return new _web3.eth.Contract(artifact.abi, artifact.networks[networkId].address, {from: account, gas: 500000})
  }
}
