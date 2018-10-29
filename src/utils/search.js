import WalletUtils from './wallet.js'

export default class Search {
  static boards = [
    { key: 'VTX', value: '0x90873c846a3667b56b10aa459d61b859d87d929fbe53a7d333ea2003176157e8' },
    { key: 'Whales', value: '0x82e85fb346e572d0508c569c22aed38c363b0e7f917d5a88fbdc7b16db6daebd' },
    { key: 'botTest', value: 'botTest' }
  ]

  // use lowercase
  static boardMap = {
    'vtx': 0,
    'whales': 1,
    'bottest': 2
  }

  // returns an array of KVPs
  static searchBoards = (target) => {
    let idx = Search.boardMap[target.toLowerCase()]
    if (idx !== undefined) {
      return [Search.boards[idx]]
    } else {
      return []
    }
  }

  // returns an array of KVPs
  static searchTokens = (target) => {
    let rv = WalletUtils.getToken(target.toUpperCase(), null)
    if (rv) {
      rv = rv.map(token => {
        return {
          'key': token.symbol, 'value': token.address
        }
      })
      return rv
    } else {
      return []
    }
  }
}
