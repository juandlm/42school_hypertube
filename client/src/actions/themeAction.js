export const changeTheme = () => {
    return dispatch => {
        dispatch({ type: "CHANGE_THEME" });
    };
};