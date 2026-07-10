import { createStore } from "redux";

const initialState = {
  userDetails: {},
  
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_USER_DETAILS":
      return {
        ...state,
        userDetails: action.payload,
      };
      case "UPDATE_DETAILS":
       
        if (action.payload?.key && action.payload?.value !== undefined) {
              
          return {
            ...state,
            [action.payload.key]: action.payload.value,  // Update dynamic key
          };
        }
        return state;
      case "DESTROY_SESSION":
      return {
        state : undefined
      };

    default:
      return state;
  }
}

const appReduxStoreService = createStore(rootReducer);

export default appReduxStoreService;
