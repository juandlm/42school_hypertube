import axios from 'axios';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';
import { 
    GET_ERRORS, 
    SET_CURRENT_USER, 
    GET_SEND
} from './types';

export const registerUser = (user, history) => dispatch => {
    axios.post('/api/users/register', user)
            .then(res => {
                sessionStorage.setItem('alert_info', 'Un mail viens de vous être envoyé, suivez les instructions pour confirmer votre inscription.');
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
                    sessionStorage.setItem('alert_success', 'Votre compte a été confirmé !');
                else
                    sessionStorage.setItem('alert_info', 'Votre compte est déjà activé');
                window.location.href = '/login';
            })
            .catch(err => {
                sessionStorage.setItem('alert_error', 'Les données transmises sont erronées');
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
                    sessionStorage.setItem('alert_info', 'Un mail viens de vous être envoyé, suivez les instructions pour confirmer votre inscription.');
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
                console.log(res);
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
                console.log(res);
                sessionStorage.setItem('alert_success', 'Mot de passe modifié avec succès !');
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
                console.log(res);
            })
            .catch(err => {
                sessionStorage.setItem('alert_error', 'Ce lien n\'est pas valide');
                window.location.href = '/login';
            });
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    window.location.href = '/login';
}
