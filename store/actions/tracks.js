import * as actionTypes from './actionTypes';
import Axios from 'axios';
import { API_KEY, SHARED_SECRET } from '../../APIconfig';
import * as Crypto from 'expo-crypto';
import { AsyncStorage } from 'react-native';

export const fetchTracksStart = () => {
    return {
        type: actionTypes.FETCH_TRACKS_START
    };
};

export const fetchTracksSuccess = (tracksArr) => {
    return {
        type: actionTypes.FETCH_TRACKS_SUCCESS,
        tracks: tracksArr
    };
};

export const fetchTracksFail = (error) => {
    return {
        type: actionTypes.FETCH_TRACKS_FAIL,
        error: error
    };
};

export const fetchTracks = (countryName) => {
    return dispatch => {
        console.log(encodeURIComponent(countryName));
        const countryNameEnc = encodeURIComponent(countryName).replace(/\(/g, '%28').replace(/\)/g, '%29');
        console.log(countryNameEnc);
        dispatch(fetchTracksStart());
        Axios.get(`http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${countryNameEnc}&api_key=${API_KEY}&format=json`).then(response => {
            if (response.data.error === 6) {
                response.data.message = 'Can\'t load tracks for ' + countryName + '.';
                dispatch(fetchTracksFail(response.data));
            } else {
                const tracksArr = [];
                response.data.tracks.track.forEach(element => {
                    tracksArr.push({
                        artistName: element.artist.name,
                        trackName: element.name
                    });
                });
                dispatch(fetchTracksSuccess(tracksArr));
            }
        }).catch(error => {
            dispatch(fetchTracksFail(error));
        });
    }
}

export const fetchDetailsStart = () => {
    return {
        type: actionTypes.FETCH_DETAILS_START
    };
};

export const fetchDetailsSuccess = (details) => {
    return {
        type: actionTypes.FETCH_DETAILS_SUCCESS,
        details: details
    };
};

export const fetchDetailsFail = (error) => {
    return {
        type: actionTypes.FETCH_DETAILS_FAIL,
        error: error
    };
};

export const fetchDetails = (artistName, trackName) => {
    return dispatch => {
        dispatch(fetchDetailsStart());
        Axios.get(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${artistName}&track=${trackName}&format=json`).then(response => {
            const track = {
                album: response.data.track.album,
                artist: response.data.track.artist ? response.data.track.artist : null,
                duration: response.data.track.duration,
                name: response.data.track.name,
                listeners: response.data.track.listeners,
                url: response.data.track.url,
                tag: response.data.track.toptags.tag,
                wiki: response.data.track.wiki ? response.data.track.wiki.summary : null
            };
            if (track.wiki) {
                let tempWiki = track.wiki.split('<a');
                track.wiki = tempWiki[0];
            }
            dispatch(fetchDetailsSuccess(track));
        }).catch(error => {
            dispatch(fetchDetailsFail(error));
        });
    }
}

export const fetchLovedStart = () => {
    return {
        type: actionTypes.FETCH_LOVED_START
    };
};

export const fetchLovedSuccess = (lovedTracksArr) => {
    return {
        type: actionTypes.FETCH_LOVED_SUCCESS,
        lovedTracks: lovedTracksArr
    };
};

export const fetchLovedFail = (error) => {
    return {
        type: actionTypes.FETCH_LOVED_FAIL,
        error: error
    };
};

export const fetchLoved = (username) => {
    return dispatch => {
        dispatch(fetchLovedStart());
        Axios.get(`http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=${username}&api_key=${API_KEY}&format=json`).then(response => {
            const lovedTracksArr = [];
            response.data.lovedtracks.track.forEach(element => {
                lovedTracksArr.push({
                    artistName: element.artist.name,
                    trackName: element.name
                });
            });
            dispatch(fetchLovedSuccess(lovedTracksArr));
        }).catch(err => {
            dispatch(fetchLovedFail(err));
        });
    }
}

export const toggleLove = (trackName, artistName, sessionKey) => {
    return async dispatch => {
        console.log('toggleLove function');
        const trackNameEnc = encodeURIComponent(trackName);
        const artistNameEnc = encodeURIComponent(artistName);
        let api_sigStr = 'api_key' + API_KEY + 'artist' + artistNameEnc + 'methodtrack.lovesk' + sessionKey +
            'track' + trackNameEnc + SHARED_SECRET;
        const api_sig = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            api_sigStr
        );

        console.log('api_sig: ' + api_sigStr);
        console.log('Digest: ', api_sig);


        const url = `https://ws.audioscrobbler.com/2.0/?method=track.love&track=${trackNameEnc}&artist=${artistNameEnc}&api_key=${API_KEY}&api_sig=${api_sig}&sk=${sessionKey}&format=json`;
        console.log(url);
        Axios.post(url).then(response => {
            console.log('track got loved');
            console.log(response);
            // AsyncStorage.setItem('username', response.data.session.name).then(json => {
            //     AsyncStorage.setItem('sessionKey', response.data.session.key).then(json => {
            //         dispatch(authSuccess(response.data.session.name, response.data.session.key));
            //     });
            // }).catch(err => {    
            //     alert(err.message);
            // });
        }).catch(error => {
            console.log(error.message);
            console.log(error.error);
            console.log(error);
            alert(error.message);
        });
    }
}

const toUTF8Array = (str) => {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            charcode = ((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff)
            utf8.push(0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}