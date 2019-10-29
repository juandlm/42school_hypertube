import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import settingsReducer from './settingsReducer'

export default combineReducers({
    errors: errorReducer,
    auth: authReducer,
    settings:settingsReducer
});
