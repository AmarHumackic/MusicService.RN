import * as actionTypes from '../actions/actionTypes';

const initialState = {
    countries: [],
    loading: false,
    error: null
}

const fetchCountriesStart = (state, action) => {
    return { ...state, loading: true };
};

const fetchCountriesSuccess = (state, action) => {
    return { ...state, loading: false, countries: action.countries, error: null };
};

const fetchCountriesFail = (state, action) => {
    return { ...state, loading: false, error: action.error };
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case(actionTypes.FETCH_COUNTRIES_START): return fetchCountriesStart(state, action);
        case(actionTypes.FETCH_COUNTRIES_SUCCESS): return fetchCountriesSuccess(state, action);
        case(actionTypes.FETCH_COUNTRIES_FAIL): return fetchCountriesFail(state, action);
        default: return state;
    }
};

export default reducer;