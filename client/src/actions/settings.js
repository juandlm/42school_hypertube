import axios from 'axios';
import { GET_ERRORS, SET_SETTINGS } from './types';
import setAuthToken from '../setAuthToken';
import { showAlert } from '../actions/alertAction';

export const setUserSettings = (settings) => {
    return {
        type: SET_SETTINGS,
        payload: settings
    }
}

export const modifySettings = (userId, settings) => dispatch => {
    axios.post('/api/users/modifySettings', { userId: userId, settings: settings })
        .then((res) => {
            // console.log('modifySettings / result', res.data);
            const token = res.data.token
            if (token) {
                localStorage.setItem('jwtToken', token)
                setAuthToken(token)
                dispatch(setUserSettings(res.data.settings))
            } else
                dispatch(setUserSettings(res.data))
            dispatch(showAlert("success", "Informations modifiés avec succès !"));
        })
        .catch(err => {
            if (err.response.status === 400)
                dispatch(showAlert("error", "Cet utilisateur ou cette email sont indisponibles"));
            else
                dispatch(showAlert("error", "La modification de vos informations a échoué"));
            // console.log('modifySettings / error', err.response);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const getUserSettings = (user) => dispatch => {
    axios.post('/api/users/getSettings', { userId: user })
        .then((res) => {
            // console.log('getSettings / result', res);
            dispatch(setUserSettings(res.data))
        })
        .catch(err => {
            dispatch({
               type: GET_ERRORS,
               payload: err.response.data
            });
       });
}
