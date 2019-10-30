import { GET_SEND } from '../actions/types';

const initialState = false;

export default function(state = initialState, action ) {
    switch(action.type) {
        case GET_SEND:
            return action.payload;
        default: 
            return state;
    }
}