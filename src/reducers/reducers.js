import { combineReducers } from "redux";
import dataReducer from "./component/dataReducer";

const rootReducer = combineReducers({
  data: dataReducer,
});

export default rootReducer;
