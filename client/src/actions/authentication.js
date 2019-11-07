import axios from 'axios';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    GET_SEND
} from './types';
import { alertTranslate } from '../translate';

const ReactLanguage = require('react-language');
ReactLanguage.setLanguage('xxx');

export const registerUser = (user, history) => dispatch => {
    axios.post('/api/users/register', user)
        .then(() => {
            sessionStorage.setItem('alert_info', alertTranslate('mailSend'));
            window.location.href = '/login';
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const registerValidationUser = (user) => dispatch => {
    axios.post('/api/users/registerValidation', user)
        .then(res => {
            if (res.data.message === 'Confirmed')
                sessionStorage.setItem('alert_success', alertTranslate('accountConfirmed'));
            else
                sessionStorage.setItem('alert_info', alertTranslate('accountAlreadyActived'));
            window.location.href = '/login';
        })
        .catch(err => {
            sessionStorage.setItem('alert_error', alertTranslate('dataFailed'));
            window.location.href = '/login';
        });
}

export const loginUser = (user) => dispatch => {
    axios.post('/api/users/login', user)
        .then(res => {
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => {
            if (err.response.data.confirmed) {
                sessionStorage.setItem('alert_info', alertTranslate('mailSend'));
                window.location.href = '/login';
            }
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const loginForgottenUser = (user) => dispatch => {
    axios.post('/api/users/loginForgotten', user)
        .then(res => {
            dispatch({
                type: GET_SEND,
                payload: true
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const loginNewPasswordUser = (user) => dispatch => {
    axios.post('/api/users/loginNewPassword', user)
        .then(res => {
            sessionStorage.setItem('alert_success', alertTranslate('pwdSuccess'));
            window.location.href = '/login';
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const loginCheckNewPasswordUser = (user) => dispatch => {
    axios.post('/api/users/loginCheckNewPassword', user)
        .then(res => {
            return true
        })
        .catch(err => {
            sessionStorage.setItem('alert_error', alertTranslate('linkFailed'));
            window.location.href = '/login';
        });
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const logoutUser = () => dispatch => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('theme');
    sessionStorage.removeItem('lang');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    window.location.href = '/login';
}
