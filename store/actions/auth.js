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

export const authSuccess = (username, sessionKey) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        username: username,
        sessionKey: sessionKey
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
        // let username = 'humast';
        // let password = 'l4mp3rij4  ';
        dispatch(authStart());
        let api_sig = 'api_key' + API_KEY + 'methodauth.getMobileSessionpassword' + password +
            'username' + username + SHARED_SECRET;
        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            api_sig
        );
        console.log('api_sig: ' + api_sig);
        console.log('Digest: ', digest);

        const url = `https://ws.audioscrobbler.com/2.0/?method=auth.getMobileSession&password=${password}&username=${username}&api_key=${API_KEY}&api_sig=${digest}&format=json`;
        console.log(url);
        Axios.post(url).then(response => {
            console.log('mobileauth');
            console.log(response);
            AsyncStorage.setItem('username', response.data.session.name).then(json => {
                AsyncStorage.setItem('sessionKey', response.data.session.key).then(json => {
                    dispatch(authSuccess(response.data.session.name, response.data.session.key));
                });
            }).catch(err => {
                alert(err.message);
            });
        }).catch(error => {
            dispatch(authFail(error));
            alert(error.message);
        });


    }
}

export const clearStorage = () => {
    return dispatch => {
        AsyncStorage.removeItem('username');
        AsyncStorage.removeItem('sessionKey');
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

