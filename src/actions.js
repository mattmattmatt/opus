/* globals Promise */

import kodi from 'kodi-ws';
/*
 * action types
 */

export const SET_HOST_STATE = 'SET_HOST_STATE';
export const SET_PLAYBACK_STATE = 'SET_PLAYBACK_STATE';
export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_CONNECTION = 'SET_CONNECTION';

/*
 * other constants
 */

export const PlaybackStates = {
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED',
    UNKOWN: 'UNKOWN',
};

let connection;

function kodiErrorHandler(error) {
    console.warn(error);
}

export function refreshConnection(ip, notificationCallback) {
    return () => {
        connection = kodi(ip, 9090);
        connection.then(c => {
            c.notification('Player.OnPause', notificationCallback);
            c.notification('Player.OnPlay', notificationCallback);
            c.notification('Player.OnStop', notificationCallback);
            c.notification('Player.OnSeek', notificationCallback);
            c.notification('Player.OnPropertyChanged', notificationCallback);
        });
    };
}

export function sendKodiCommand(method, params) {
    if (!connection) {
        return Promise.reject('IP not set');
    }

    return connection.then(c => {
        return c.run(method, params);
    });
}

export function fetchHostState() {
    return (dispatch) => {
        sendKodiCommand('Player.GetActivePlayers').then((result) => {
            if (result.length === 0) {
                dispatch(setPlaybackState(PlaybackStates.STOPPED));
            }
            dispatch(setHostState({ activePlayers: result }));
        }, kodiErrorHandler);
        sendKodiCommand('XBMC.GetInfoBooleans', { 'booleans': ['Player.Paused', 'Player.Playing'] }).then((result) => {
            let playbackState;

            if (!result['Player.Paused'] && !result['Player.Playing']) {
                playbackState = PlaybackStates.STOPPED;
            } else if (result['Player.Paused']) {
                playbackState = PlaybackStates.PAUSED;
            } else if (result['Player.Playing']) {
                playbackState = PlaybackStates.PLAYING;
            } else {
                playbackState = PlaybackStates.UNKOWN;
            }
            dispatch(setPlaybackState(playbackState));
        }, kodiErrorHandler);
    };
}

/*
 * action creators
 */

export function setHostState(hostState) {
    return { type: SET_HOST_STATE, hostState };
}

export function setPlaybackState(playbackState) {
    return { type: SET_PLAYBACK_STATE, playbackState };
}

export function setSettings(settings) {
    return { type: SET_SETTINGS, settings };
}

export function setConnection(connection) {
    return { type: SET_CONNECTION, connection };
}
