import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dataReducer from "./component/dataReducer";
import modalStateReducer from "./component/modalStateReducer";
import detailInfoReducer from "./component/detailInfoReducer";
import currReducer from "./component/currReducer";
import bcmReducer from "./component/bcmReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["beamCurr", "dtl20BCM"],
};

const rootReducer = combineReducers({
  data: dataReducer,
  modalState: modalStateReducer,
  detailInfo: detailInfoReducer,
  beamCurr: currReducer,
  dtl20BCM: bcmReducer,
});

export default persistReducer(persistConfig, rootReducer);
