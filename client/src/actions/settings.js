import axios from 'axios';
import { 
    GET_ERRORS, 
    // SET_CURRENT_USER, 
    SET_SETTINGS
} from './types';
import setAuthToken from '../setAuthToken';
// import jwt_decode from 'jwt-decode';
// import { setCurrentUser } from './authentication'

export const setUserSettings = (settings) => {
    return {
        type: SET_SETTINGS,
        payload: settings
    }
}

export const modifySettings = (userId, settings) => dispatch => {
    axios.post('api/users/modifySettings', { userId:userId, settings:settings })
         .then((response) => {
           const token = response.data.token
           if (token){
             localStorage.setItem('jwtToken', token)
             setAuthToken(token)
             dispatch(setUserSettings(response.data.settings))
          }else
            dispatch(setUserSettings(response.data))
         }).catch(err => {
             dispatch({
                 type: GET_ERRORS,
                 payload: err.response.data
             });
         });
}

export const getUserSettings = (user) => dispatch => {
  axios.post('api/users/getSettings', {userId: user})
       .then((response) => {
         console.log(response)
           dispatch(setUserSettings(response.data))
       }).catch(err => {
           dispatch({
               type: GET_ERRORS,
               payload: err.response.data
           });
       });
}
