import { SET_SETTINGS } from '../actions/types';
// import isEmpty from '../validation/is-empty';

const initialState = {
    data:{}
}

export default function(state = initialState, action ) {
//   console.log(action.payload)
    switch(action.type) {
        case SET_SETTINGS:
            return {
                ...state,
                data:action.payload
            }
        default:
            return state;
    }
}
