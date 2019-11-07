import { CHANGE_THEME } from './types';

export const changeTheme = (theme) => {
    let newTheme;
    if (theme === true)
        newTheme = false;
    else
        newTheme = true;

    localStorage.setItem('theme', newTheme);

    const action = {
        type: CHANGE_THEME,
        payload: newTheme
    }
    return dispatch => {
        dispatch(action);
    };

};