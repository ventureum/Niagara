import Config from 'react-native-config';
import EthereumJsWallet from 'ethereumjs-wallet';
import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet';
import ProviderSubprovider from 'web3-provider-engine/subproviders/provider';
import { store } from '../boot/configureStore.js';

import { ERC20ABI } from './abi/ERC20.js';

export default class WalletUtils {
  /**
   * Reads an EthereumJSWallet instance from Redux store
   */
  static getWallet() {
    const { walletReducer } = store.getState();

    return EthereumJsWallet.fromPrivateKey(Buffer.from(walletReducer.privateKey, 'hex'));
  }

  static getWeb3HTTPProvider() {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
    switch (store.getState().network) {
      case 'ropsten':
        return new Web3.providers.HttpProvider(
          `https://ropsten.infura.io/${Config.INFURA_API_KEY}`,
        );
      case 'kovan':
        return new Web3.providers.HttpProvider(
          `https://kovan.infura.io/${Config.INFURA_API_KEY}`,
        );
      case 'rinkeby':
        return new Web3.providers.HttpProvider(
          `https://rinkeby.infura.io/${Config.INFURA_API_KEY}`,
        );
      default:
        return new Web3.providers.HttpProvider(
          `https://mainnet.infura.io/${Config.INFURA_API_KEY}`,
        );
    }
  }

  /**
   * Returns a web3 instance with the user's wallet
   */
  static getWeb3Instance() {
    const wallet = this.getWallet();

    const engine = new ProviderEngine();

    engine.addProvider(new WalletSubprovider(wallet, {}));
    engine.addProvider(new ProviderSubprovider(this.getWeb3HTTPProvider()));

    engine.start()

    const web3 = new Web3(engine)

    web3.eth.defaultAccount = wallet.getAddressString();

    return web3;
  }


  /**
   * Get the user's wallet balance of a given token
   *
   * @param {Object} token
   */
  static getBalance({ contractAddress, symbol, decimals }) {
    if (symbol === 'ETH') {
      return this.getEthBalance();
    }

    return this.getERC20Balance(contractAddress, decimals);
  }

  /**
   * Get the user's wallet ETH balance
   */
  static getEthBalance() {
    const { walletAddress } = store.getState();

    const web3 = new Web3(this.getWeb3HTTPProvider());

    return new Promise((resolve, reject) => {
      web3.eth.getBalance(walletAddress, (error, weiBalance) => {
        if (error) {
          reject(error);
        }

        const balance = weiBalance / Math.pow(10, 18);

        resolve(balance);
      });
    });
  }

  /**
   * Get the user's wallet balance of a specific ERC20 token
   *
   * @param {String} contractAddress
   * @param {Number} decimals
   */
  static getERC20Balance(contractAddress, decimals) {
    const { walletAddress } = store.getState();

    const web3 = new Web3(this.getWeb3HTTPProvider());

    return new Promise((resolve, reject) => {
      web3.eth
          .contract(erc20Abi)
          .at(contractAddress)
          .balanceOf(walletAddress, (error, decimalsBalance) => {
            if (error) {
              reject(error);
            }

            const balance = decimalsBalance / Math.pow(10, decimals);

            resolve(balance);
          });
    });
  }
}
