import { combineReducers } from "redux";
import authReducer from "./Reducers/authReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    // các reducer khác
});

export default rootReducer;
