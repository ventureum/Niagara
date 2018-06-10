export function setPinCode(pinCode: string) {
	return dispatch => {
		dispatch({
			type: "SET_PIN_CODE",
			pinCode,
		})
	};
}

export function setWalletAddress(address: string) {
	return dispatch => {
		dispatch({
			type: "SET_WALLET_ADDRESS",
			address,
		})
	};
}

export function setPrivateKey(privKey: string) {
	return dispatch => {
		dispatch({
			type: "SET_PRIVATE_KEY",
			privKey,
		})
	};
}