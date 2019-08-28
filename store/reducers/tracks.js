import * as actionTypes from '../actions/actionTypes';

const initialState = {
    tracks: [],
    loved: [],
    details: null,
    loading: false,
    error: null
}

const fetchTracksStart = (state, action) => {
    return { ...state, loading: true };
};

const fetchTracksSuccess = (state, action) => {
    return { ...state, loading: false, tracks: action.tracks, error: null };
};

const fetchTracksFail = (state, action) => {
    return { ...state, loading: false, error: action.error };
};

const fetchDetailsStart = (state, action) => {
    return { ...state, loading: true, details: null };
};

const fetchDetailsSuccess = (state, action) => {
    return { ...state, loading: false, details: action.details, error: null };
};

const fetchDetailsFail = (state, action) => {
    return { ...state, loading: false, error: action.error };
};

const fetchLovedStart = (state, action) => {
    return { ...state, loading: true };
};

const fetchLovedSuccess = (state, action) => {
    return { ...state, loading: false, loved: action.lovedTracks, error: null };
};

const fetchLovedFail = (state, action) => {
    return { ...state, loading: false, error: action.error };
};

const setToogleLove = (state, action) => {
    if (action.typeLove === 'love') {
        const newTrack = { artistName: action.artistName, trackName: action.trackName };
        //adding item at the start of the array
        return { ...state, loved: [newTrack, ...state.loved] };
    } else if(action.typeLove === 'unlove') {
        const newLoved = state.loved.filter(item => item.artistName !== action.artistName || item.trackName !== action.trackName);
        return { ...state, loved: newLoved };
    }
};

const resetLoved = (state, action) => {
    return { ...state, loved: [] };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (actionTypes.FETCH_TRACKS_START): return fetchTracksStart(state, action);
        case (actionTypes.FETCH_TRACKS_SUCCESS): return fetchTracksSuccess(state, action);
        case (actionTypes.FETCH_TRACKS_FAIL): return fetchTracksFail(state, action);
        case (actionTypes.FETCH_DETAILS_START): return fetchDetailsStart(state, action);
        case (actionTypes.FETCH_DETAILS_SUCCESS): return fetchDetailsSuccess(state, action);
        case (actionTypes.FETCH_DETAILS_FAIL): return fetchDetailsFail(state, action);
        case (actionTypes.FETCH_LOVED_START): return fetchLovedStart(state, action);
        case (actionTypes.FETCH_LOVED_SUCCESS): return fetchLovedSuccess(state, action);
        case (actionTypes.FETCH_LOVED_FAIL): return fetchLovedFail(state, action);
        case (actionTypes.SET_TOOGLE_LOVE): return setToogleLove(state, action);
        case (actionTypes.RESET_LOVED): return resetLoved(state, action);
        default: return state;
    }
};

export default reducer;