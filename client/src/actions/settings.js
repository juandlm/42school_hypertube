import axios from 'axios';
import { GET_ERRORS, SET_SETTINGS } from './types';
import setAuthToken from '../setAuthToken';
import { showAlert } from '../actions/alertAction';
import { alertTranslate } from '../translate';

const ReactLanguage = require('react-language');
ReactLanguage.setLanguage('xxx');

export const setUserSettings = (settings) => {
    return {
        type: SET_SETTINGS,
        payload: settings
    }
}

export const modifySettings = (userId, settings) => dispatch => {
    axios.post('/api/users/modifySettings', { userId: userId, settings: settings })
        .then((res) => {
            const token = res.data.token
            if (token) {
                localStorage.setItem('jwtToken', token)
                setAuthToken(token)
                dispatch(setUserSettings(res.data.settings))
            } else
                dispatch(setUserSettings(res.data))
            dispatch(showAlert("success", alertTranslate('infoSuccess')));
        })
        .catch(err => {
            if (err.response.status === 400)
                dispatch(showAlert("error", alertTranslate('infoError')));
            else
                dispatch(showAlert("error", alertTranslate('infoIndisp')));
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const getUserSettings = (user) => dispatch => {
    axios.post('/api/users/getSettings', { userId: user })
        .then((res) => {
            dispatch(setUserSettings(res.data))
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}
