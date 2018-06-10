import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import homeReducer from "../container/HomeContainer/reducer";
import walletReducer from "../container/CreateWalletContainer/reducer";

export default combineReducers({
	form: formReducer,
	homeReducer,
  walletReducer
});
