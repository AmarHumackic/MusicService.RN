import * as actionTypes from './actionTypes';
import { AsyncStorage } from 'react-native';
import Axios from 'axios';

export const fetchCountriesStart = () => {
    return {
        type: actionTypes.FETCH_COUNTRIES_START
    };
};

export const fetchCountriesSuccess = (countriesArr) => {
    return {
        type: actionTypes.FETCH_COUNTRIES_SUCCESS,
        countries: countriesArr
    };
};

export const fetchCountriesFail = (error) => {
    return {
        type: actionTypes.FETCH_COUNTRIES_FAIL,
        error: error
    };
};

export const fetchCountries = () => {
    return dispatch => {
        let countries = null;
        AsyncStorage.getItem('countries').then(req => JSON.parse(req)).then(json => {
            countries = json;
            if (countries) {
                dispatch(fetchCountriesSuccess(countries));
            } else {
                dispatch(fetchCountriesStart());
                Axios.get('https://restcountries.eu/rest/v2/all').then(response => {
                    const countriesArr = [];
                    response.data.forEach(element => {
                        countriesArr.push({
                            name: element.name,
                            flag: element.flag
                        });
                    });
                    AsyncStorage.setItem('countries', JSON.stringify(countriesArr)).then(json => {
                        console.log('AsyncStorage --- countries setted');
                    });
                    dispatch(fetchCountriesSuccess(countriesArr));
                }).catch(error => {
                    dispatch(fetchCountriesFail(error));
                });
            }
        });
    }
}
