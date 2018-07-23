export default class WalletUtils {

  static boards = [
    { key: 'VTX', value: '0x90873c846a3667b56b10aa459d61b859d87d929fbe53a7d333ea2003176157e8'},
    { key: 'Whales', value: '0x82e85fb346e572d0508c569c22aed38c363b0e7f917d5a88fbdc7b16db6daebd'}
  ]

  // use lowercase
  static boardMap = {
    'vtx' : 0,
    'whales': 1
  }

  // returns an array of KVPs
  static searchBoards(target) {
    let idx = this.boardMap[target.toLowerCase()]
    if (idx !== undefined) {
      return [this.boards[idx]]
    } else {
      return []
    }
  }
}
