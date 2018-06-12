import Web3 from 'web3'
import HDWalletProvider from 'truffle-hdwallet-provider'

const mnemonic = 'loop include whale off rule whip betray report grief cancel gadget park'
const provider = (new HDWalletProvider(
  mnemonic,
  'https://rinkeby.infura.io/g3Bqiyu1vVVfpzgMMWKN'))
// if (fs.existsSync('mnemonic.txt')) {
//     mnemonic = fs.readFileSync('mnemonic.txt').toString().split('\n')[0]
// }

const web3 = new Web3(provider)

export default web3
