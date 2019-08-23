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
                        console.log('setted');
                    }).catch(err => {
                        console.log('error setting');
                    });
                    dispatch(fetchCountriesSuccess(countriesArr));
                }).catch(error => {
                    console.log(error);
                });
            }
        }).catch(err => {
            console.log(err.message);
        });
        
    }
}

storeData = async (countriesArr) => {
    try {
        await AsyncStorage.setItem('countries', countriesArr);
        console.log('Async setted');
    } catch (error) {
        console.log('Async set error');
        // Error saving data
    }
};

retrieveData = async () => {
    let data = null;
    try {
        data = await AsyncStorage.getItem('countries');
        if (data !== null) {
            // We have data!!
            console.log('Async getted');
            console.log(data);
        }
    } catch (error) {
        console.log('Async get error');
        // Error retrieving data
    }
    return data;
};