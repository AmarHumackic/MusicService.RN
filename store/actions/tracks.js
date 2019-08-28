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

export const fetchTracks = (countryName, limit, page) => {
    return dispatch => {
        console.log(encodeURIComponent(countryName));
        const countryNameEnc = encodeURIComponent(countryName).replace(/\(/g, '%28').replace(/\)/g, '%29');
        console.log(countryNameEnc);
        dispatch(fetchTracksStart());
        Axios.get(`http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${countryNameEnc}&api_key=${API_KEY}&format=json&limit=${limit}&page=${page}`).then(response => {
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

        console.log(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${artistName}&track=${trackName}&format=json`);
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

export const resetLoved = () => {
    return {
        type: actionTypes.RESET_LOVED
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

export const setToogleLove = (artistName, trackName, typeLove) => {
    return {
        type: actionTypes.SET_TOOGLE_LOVE,
        artistName: artistName,
        trackName: trackName,
        typeLove: typeLove
    };
}

export const toggleLove = (artistName, trackName, sessionKey, typeLove) => {
    return async dispatch => {
        const trackNameEnc = decodeURIComponent(escape(trackName));
        const artistNameEnc = decodeURIComponent(escape(artistName));

        let api_sigStr = `api_key${API_KEY}artist${artistNameEnc}methodtrack.${typeLove}sk${sessionKey}track${trackNameEnc}${SHARED_SECRET}`;
        const api_sig = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            api_sigStr
        );

        let url = `https://ws.audioscrobbler.com/2.0/?method=track.${typeLove}&track=${escape(trackName)}&artist=${escape(artistName)}&api_key=${API_KEY}&api_sig=${api_sig}&sk=${sessionKey}&format=json`;
        Axios.post(url).then(response => {
            dispatch(setToogleLove(artistName, trackName, typeLove));
        }).catch(error => {
            alert(error.message);
        });
    }
}
