import WalletUtils from '../../utils/wallet'
import { newTransaction } from '../TransactionContainer/actions'

const DEFAULT_GAS_LIMIT = 500000

function _sendTransaction (receiverAddress, tokenSymbol, tokenAddress, amount, gasLimit, newTransaction) {
  return {
    type: 'SEND_TRANSACTION',
    payload: WalletUtils.sendTransaction(receiverAddress, tokenSymbol, tokenAddress, amount, gasLimit, newTransaction)
  }
}

function sendTransaction (receiverAddress, tokenSymbol, tokenAddress, amount) {
  return (dispatch) => {
    dispatch(_sendTransaction(
      receiverAddress,
      tokenSymbol,
      tokenAddress,
      amount,
      DEFAULT_GAS_LIMIT,
      (txHash) => { dispatch(newTransaction(txHash)) }
    ))
  }
}

export { sendTransaction }
