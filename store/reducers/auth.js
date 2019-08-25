import * as actionTypes from '../actions/actionTypes';

const initialState = {
    username: null,
    sessionKey: null,
    loading: false,
    error: null
}

const authStart = (state, action) => {
    return { ...state, loading: true };
};

const authSuccess = (state, action) => {
    return { ...state, loading: false, username: action.username, sessionKey: action.sessionKey, error: null };
}

const authFail = (state, action) => {
    return { ...state, loading: false, error: action.error };
}

const removeData = (state, action) => {
    return { ...state, username: null, sessionKey: null };
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case(actionTypes.AUTH_START): return authStart(state, action);
        case(actionTypes.AUTH_SUCCESS): return authSuccess(state, action);
        case(actionTypes.AUTH_FAIL): return authFail(state, action);
        case(actionTypes.REMOVE_DATA): return removeData(state, action);
        default: return state;
    }
};

export default reducer;