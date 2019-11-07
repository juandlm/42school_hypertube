export const showAlert = (variant, message) => {
    return dispatch => {
        dispatch({
            type: "ALERT_OPEN",
            variant,
            message
        });
    };
};

export const clearAlert = () => {
    return dispatch => {
        dispatch({ type: "ALERT_CLEAR" });
    };
};