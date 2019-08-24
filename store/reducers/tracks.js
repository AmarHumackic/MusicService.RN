import * as actionTypes from '../actions/actionTypes';

const initialState = {
    tracks: [],
    details: null,
    loading: false,
    error: null
}

const fetchTracksStart = (state, action) => {
    return { ...state, loading: true };
};

const fetchTracksSuccess = (state, action) => {
    return { ...state, loading: false, tracks: action.tracks, error: null };
}

const fetchTracksFail = (state, action) => {
    return { ...state, loading: false, error: action.error };
}

const fetchDetailsStart = (state, action) => {
    return { ...state, loading: true, details: null };
};

const fetchDetailsSuccess = (state, action) => {
    return { ...state, loading: false, details: action.details, error: null };
}

const fetchDetailsFail = (state, action) => {
    return { ...state, loading: false, error: action.error };
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case(actionTypes.FETCH_TRACKS_START): return fetchTracksStart(state, action);
        case(actionTypes.FETCH_TRACKS_SUCCESS): return fetchTracksSuccess(state, action);
        case(actionTypes.FETCH_TRACKS_FAIL): return fetchTracksFail(state, action);
        case(actionTypes.FETCH_DETAILS_START): return fetchDetailsStart(state, action);
        case(actionTypes.FETCH_DETAILS_SUCCESS): return fetchDetailsSuccess(state, action);
        case(actionTypes.FETCH_DETAILS_FAIL): return fetchDetailsFail(state, action);
        default: return state;
    }
};

export default reducer;