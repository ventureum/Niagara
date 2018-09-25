import Config from 'react-native-config'
import Web3 from 'web3'
import { store } from '../boot/configureStore.js'
import { Platform } from 'react-native'
import { ERC20_ABI } from './contracts/ERC20.js'
import TCRRegistry from './contracts/Registry'
import Token from './contracts/VetXToken'
import tokenData from './tokens.json'
import Forum from './contracts/Forum'
import Identicon from 'identicon.js'
import { Toast } from 'native-base'

export default class WalletUtils {
  static ERC20 = './abi/ERC20.js'

  static web3;

  static addressToToken = {}
  static symbolToToken = {}
  static tokens = []

  /*
    This function provides components with the functionality to send ether/ERC20 transaction.
    @param receiverAddress The address of the receiver
    @param tokenSymbol The symbol of the token
    @param tokenAddress The address of the token
    @param amount The amount to be send
    @param gasLimit The gas limit for the transaction
    @param newTransaction A callback function to be called when a new transaction
      is sent but before receipt is issued
  */
  static async sendTransaction (receiverAddress, tokenSymbol, tokenAddress, amount, gasLimit = 500000, newTransaction) {
    const { walletReducer } = store.getState()

    const _web3 = this.getWeb3Instance()
    let promise
    if (tokenSymbol === 'ETH' && tokenAddress === null) {
      const value = _web3.utils.toWei(amount, 'ether')
      promise = _web3.eth.sendTransaction({
        from: walletReducer.walletAddress,
        to: receiverAddress,
        value: value,
        gas: gasLimit
      })
    } else {
      const tokenInstance = this.getERC20Instance(tokenAddress)
      let decimals = await tokenInstance.methods.decimals().call()
      let BN = _web3.utils.BN
      let base = (new BN(10)).pow(new BN(decimals))
      let value = base.mul(new BN(amount))
      promise = tokenInstance.methods.transfer(receiverAddress, value).send({
        from: walletReducer.walletAddress,
        gas: gasLimit
      })
    }

    promise.on('transactionHash', (hash) => {
      newTransaction(hash)
    }).on('error', (error) => {
      console.log(error)
      Toast.show({
        text: 'Error in sending the transaction.',
        position: 'center',
        buttonText: 'Okay',
        type: 'danger',
        duration: 10000
      })
    }).on('receipt', () => {
      Toast.show({
        text: 'Transaction is fulfilled!',
        buttonText: 'Okay',
        type: 'success',
        position: 'center',
        duration: 10000
      })
    })
  }

  /*
   * Reads an Web3 wallet instance from Redux store
   */
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
        // For iOS
        if (Platform.OS === 'ios') {
          return new Web3.providers.HttpProvider(
            'http://127.0.0.1:8545'
          )
        }
        // For Android
        return new Web3.providers.HttpProvider(
          'http://10.0.2.2:8545'
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
  static getBalance ({ address, symbol, decimals }) {
    if (symbol === 'ETH') {
      return this.getEthBalance()
    }

    return this.getERC20Balance(address, decimals)
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
    const account = this.getWallet().walletAddress
    return new _web3.eth.Contract(ERC20_ABI, address, { from: account, gas: 500000 })
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
      case 'Forum':
        artifact = Forum
        break
      default:
        return new Error('Invalid contract name received.')
    }

    return new _web3.eth.Contract(artifact.abi, artifact.networks[networkId].address, { from: account, gas: 500000 })
  }

  /*
    generate user avatar by its address
  */
  static getAvatar (address = '') {
    let identiconData
    if (address.length !== 0) {
      if (address.length < 42) {
        address = this.web3.utils.sha3(address)
      }
      identiconData = new Identicon(address, 64).toString()
    } else {
      address = this.getWallet().walletAddress
      identiconData = new Identicon(address, 64).toString()
    }
    return ('data:image/png;base64,' + identiconData)
  }

  /*
    generate the abbreviation of user address
  */
  static getAddrAbbre (address) {
    return address.slice(0, 8) + '...' + address.slice(-6)
  }

  /*
     Load a list of erc20 tokens
   */
  static loadTokens () {
    this.tokens = tokenData.tokens

    // Modify the following token info for testing
    this.tokens.push({
      'symbol': 'VTX',
      'address': '0xce11c2df65aaa6a1b15596da6f9d26c6e78fff50',
      'decimals': 18,
      'name': 'VetX Token'
    })

    for (var i = 0; i < this.tokens.length; i++) {
      let token = this.tokens[i]
      this.addressToToken[token.address] = i
      if (this.symbolToToken[token.symbol]) {
        this.symbolToToken[token.symbol].push(i)
      } else {
        this.symbolToToken[token.symbol] = [i]
      }
    }
  }

  /*
     Return a list of token data given symbol or address
     @param {string} symbol - symbol of a token
     @param {string} address - address of a token
     @returns {(Object | Array)} (array of) token data
     including address, symbol, name, decimals, etc
   */
  static getToken (symbol, address) {
    if (address && this.addressToToken[address]) {
      return this.tokens[this.addressToToken[address]]
    } else if (this.symbolToToken[symbol]) {
      let rv = []
      for (var i = 0; i < this.symbolToToken[symbol].length; i++) {
        let idx = this.symbolToToken[symbol][i]
        rv.push(this.tokens[idx])
      }
      return rv
    }
    return null
  }
}
