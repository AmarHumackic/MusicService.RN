import * as actionTypes from '../actions/actionTypes';

const initialState = {
    username: null,
    sessionKey: null,
    api_sig: null,
    loading: false,
    error: null,
    authRedirectPath: '/'
}

const authStart = (state, action) => {
    return { ...state, loading: true };
};

const authSuccess = (state, action) => {
    return {
        ...state,
        loading: false,
        username: action.username,
        sessionKey: action.sessionKey,
        api_sig: action.api_sig,
        error: null
    };
}

const authFail = (state, action) => {
    return { ...state, loading: false, error: action.error };
}

const removeData = (state, action) => {
    return { ...state, username: null, sessionKey: null, api_sig: null };
}

const setAuthRedirectPath = (state, action) => {
    return { ...state, authRedirectPath: action.path };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (actionTypes.AUTH_START): return authStart(state, action);
        case (actionTypes.AUTH_SUCCESS): return authSuccess(state, action);
        case (actionTypes.AUTH_FAIL): return authFail(state, action);
        case (actionTypes.REMOVE_DATA): return removeData(state, action);
        case (actionTypes.SET_AUTH_REDIRECT_PATH): return setAuthRedirectPath(state, action);
        default: return state;
    }
};

export default reducer;