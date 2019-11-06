import { CHANGE_THEME } from '../actions/types';

let initState;
if (localStorage.getItem('theme') === 'false')
    initState = { theme: false }
else
    initState = { theme: true }

const themeReducer = (state = initState, action) => {
    switch (action.type) {
        case CHANGE_THEME:
            return {
                ...state,
                theme: action.payload
            };
        default:
            return state;
    }
};
  
export default themeReducer;