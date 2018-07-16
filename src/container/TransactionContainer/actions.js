import WalletUtils from '../../utils/wallet'

function newTransaction (txHash) {
  return {
    type: 'NEW_TRANSACTION',
    payload: txHash
  }
}
function updateTransaction (receipt) {
  return {
    type: 'UPDATE_TRANSACTION',
    payload: receipt
  }
}

async function fetchTransactionStatus (transactionHash) {
  const web3 = await WalletUtils.getWeb3Instance()
  const receipt = await web3.eth.getTransactionReceipt(transactionHash)
  return receipt
}

function _updateTransactionStatus (transactions) {
  return {
    type: 'UPDATE_TRANSACTION',
    payload: Promise.all(transactions.map((transaction, i) => {
      return fetchTransactionStatus(transaction.hash)
    }))
  }
}
function updateTransactionStatus () {
  return (dispatch, getState) => {
    let pendingTransactions = []
    const transactions = getState().transactionReducer.transactions
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].status === 'Pending') {
        pendingTransactions.push(transactions[i])
      }
    }
    dispatch(_updateTransactionStatus(pendingTransactions))
  }
}
export { newTransaction, updateTransaction, updateTransactionStatus }
