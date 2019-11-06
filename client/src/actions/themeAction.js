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
    // dispatch(action);
    return dispatch => {
        dispatch(action);
    };

};


// export const switchThemeTo = (theme) => dispatch => {

//     if (theme === true)
//         dispatch(changeTheme(false))
//     else
//         dispatch(changeTheme(true))
// }