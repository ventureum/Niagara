import { BigNumber } from 'bignumber.js'

const initialState = {
	loading: false,
  tokens: [{
    symbol: 'ETH',
    address: '0x0000000000000000000000000000000000000000',
    balance: new BigNumber(0),
    value: 0
  },{
    symbol: 'VTX',
    address: '0xb8a004cbb640a4194dad812de9af4ea61954b5cd',
    balance: new BigNumber(0),
    value: 0
  }],
  totalVal: 0
};

export default function(state: any = initialState, action: Function) {
	if (action.type === "FETCH_TOKEN_LIST_PENDING") {
		return {
			...state,
			loading: true,
		};
	}
	if (action.type === "FETCH_TOKEN_LIST_FULFILLED") {
    let data = action.payload.data
    ethData = {
      balance: data.ETH.balance,
      tokenInfo: {
        decimals: '0',
        symbol: 'ETH'
      }
    }
		return {
			...state,
			loading: false,
      error: false,
      tokens: [ethData, ...data.tokens]
		};
	}
  if (action.type === "FETCH_TOKEN_LIST_REJECTED") {
		return {
			...state,
			loading: false,
      error: true
		};
	}
	return state;
}
