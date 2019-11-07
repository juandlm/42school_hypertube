const uiReducer = (state = {}, action) => {
    switch (action.type) {
        case "ALERT_OPEN":
            return {
                ...state,
                alertOpen: true,
                alertVariant: action.variant,
                alertMessage: action.message
            };
        case "ALERT_CLEAR":
            return {
                ...state,
                alertOpen: false
            };
        default:
            return state;
    }
};

export default uiReducer;