import * as actionTypes from './actionTypes';
import Axios from 'axios';
import { API_KEY } from '../../APIconfig';


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
        dispatch(fetchTracksStart());
        Axios.get(`http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${countryName}&api_key=${API_KEY}&format=json`).then(response => {
            console.log(response);
            const tracksArr = [];
            response.data.tracks.track.forEach(element => {
                tracksArr.push({
                    artistName: element.artist.name,
                    trackName: element.name
                });
            });
            dispatch(fetchTracksSuccess(tracksArr));
        }).catch(error => {
            console.log(error);
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
            console.log(response);
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
            console.log(error);
            dispatch(fetchDetailsFail(error));
        });
    }
}