const initialState = {
	pinCode: '',
	walletAddress: '',
	privateKey: ''
};

export default function(state: any = initialState, action: Function) {
	if (action.type === "SET_PIN_CODE") {
		return {
			...state,
			pinCode: action.pinCode,
		};
	}
	if (action.type === "SET_WALLET_ADDRESS") {
		return {
			...state,
			walletAddress: action.address,
		};
	}
	if (action.type === "SET_PRIVATE_KEY") {
		return {
			...state,
			privateKey: action.privKey,
		};
	}
	return state;
}
