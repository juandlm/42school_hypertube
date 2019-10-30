import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import settingsReducer from './settingsReducer'
import sendReducer from './sendReducer';

export default combineReducers({
    errors: errorReducer,
    auth: authReducer,
    settings:settingsReducer,
    send: sendReducer,
});
