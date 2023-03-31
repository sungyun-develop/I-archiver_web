import { combineReducers } from "redux";
import dataReducer from "./component/dataReducer";
import modalStateReducer from "./component/modalStateReducer";
import detailInfoReducer from "./component/detailInfoReducer";

const rootReducer = combineReducers({
  data: dataReducer,
  modalState: modalStateReducer,
  detailInfo: detailInfoReducer,
});

export default rootReducer;
