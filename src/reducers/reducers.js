import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import dataReducer from "./component/dataReducer";
import modalStateReducer from "./component/modalStateReducer";
import detailInfoReducer from "./component/detailInfoReducer";
import currReducer from "./component/currReducer";
import bcmReducer from "./component/bcmReducer";
import arcmodalReducer from "./component/arcmodalReducer";
import AnameReducer from "./component/AnameReducer";
import AtimeReducer from "./component/AtimeReducer";
import modalStateReducer2 from "./component/modalStateReducer2";
import AnnotationContent from "./component/AnnotationContent";

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
  arcmodalSts: arcmodalReducer,
  alarmname: AnameReducer,
  alarmtime: AtimeReducer,
  modalstate: modalStateReducer2,
  annotContent: AnnotationContent,
});

export default persistReducer(persistConfig, rootReducer);
