import { SET_SETTINGS } from '../actions/types';

const initialState = {
    data:{}
}

export default function(state = initialState, action ) {
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
