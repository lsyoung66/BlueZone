import { legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {
  ownerInfo: null,
  ownerAddInfo: null,
  tableInfo: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "OWNER_INFO":
      return {
        ...state,
        ownerInfo: action.payload
      };
    case "OWNER_ADD_INFO":
      return {
        ...state,
        ownerAddInfo: action.payload
      };
    case "TABLE_INFO":
      return {
        ...state,
        tableInfo: action.payload
      };
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  composeWithDevTools()
);

export default store;