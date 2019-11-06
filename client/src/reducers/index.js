import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import settingsReducer from './settingsReducer'
import sendReducer from './sendReducer';
import uiReducer from './uiReducer';
import themeReducer from './themeReducer';

export default combineReducers({
    errors: errorReducer,
    auth: authReducer,
    settings:settingsReducer,
    send: sendReducer,
    ui: uiReducer,
    theme: themeReducer
});
