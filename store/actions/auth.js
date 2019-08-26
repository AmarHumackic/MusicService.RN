import * as actionTypes from './actionTypes';
import Axios from 'axios';
import { API_KEY, SHARED_SECRET } from '../../APIconfig';
import * as Crypto from 'expo-crypto';
import { AsyncStorage } from 'react-native';


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
        console.log('api_sig: ' + api_sigStr);
        console.log('Digest: ', api_sig);

        const url = `https://ws.audioscrobbler.com/2.0/?method=auth.getMobileSession&password=${password}&username=${username}&api_key=${API_KEY}&api_sig=${api_sig}&format=json`;
        console.log(url);
        Axios.post(url).then(response => {
            console.log('mobileauth');
            console.log(response);
            AsyncStorage.setItem('username', response.data.session.name).then(json => {
                AsyncStorage.setItem('sessionKey', response.data.session.key).then(json => {
                    AsyncStorage.setItem('api_sig', api_sig).then(json => {
                        dispatch(authSuccess(response.data.session.name, response.data.session.key, api_sig));
                        console.log('api_sig setted: ' + api_sig);
                    })
                });
            }).catch(err => {
                alert(err.message);
            });
        }).catch(error => {
            alert(error.message);
            dispatch(authFail(error));
        });


    }
}

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
    };
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};