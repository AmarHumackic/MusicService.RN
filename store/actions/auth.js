import * as actionTypes from './actionTypes';
import Axios from 'axios';
import { API_KEY, SHARED_SECRET } from '../../APIconfig';
import * as Crypto from 'expo-crypto';
import { AsyncStorage } from 'react-native';
import { fetchLoved, resetLoved } from './tracks';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    };
};

export const authSuccess = (username, sessionKey, api_sig) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        username: username,
        sessionKey: sessionKey,
        api_sig: api_sig
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const auth = (username, password) => {
    return async dispatch => {
        dispatch(authStart());
        let api_sigStr = 'api_key' + API_KEY + 'methodauth.getMobileSessionpassword' + password +
            'username' + username + SHARED_SECRET;
        const api_sig = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            api_sigStr
        );

        const url = `https://ws.audioscrobbler.com/2.0/?method=auth.getMobileSession&password=${password}&username=${username}&api_key=${API_KEY}&api_sig=${api_sig}&format=json`;
        Axios.post(url).then(response => {
            if (response.data.error === 4) {
                response.data.message = 'Invalid username or password.';
                dispatch(authFail(response.data));
            } else {
                AsyncStorage.setItem('username', response.data.session.name).then(json => {
                    AsyncStorage.setItem('sessionKey', response.data.session.key).then(json => {
                        AsyncStorage.setItem('api_sig', api_sig).then(json => {
                            dispatch(authSuccess(response.data.session.name, response.data.session.key, api_sig));
                            dispatch(fetchLoved(username));
                        })
                    });
                });
            }
        }).catch(error => {
            if (error.message === 'Request failed with status code 403') {
                alert('Invalid username or password.');
            } else {
                alert('No network connection.')
            }
            dispatch(authFail(error));
        });
    };
};

export const clearStorage = () => {
    return dispatch => {
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('sessionKey');
        AsyncStorage.removeItem('api_sig');
    };
};

export const removeData = () => {
    return {
        type: actionTypes.REMOVE_DATA
    };
};

export const logout = () => {
    return dispatch => {
        dispatch(clearStorage());
        dispatch(removeData());
        dispatch(resetLoved());
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};
