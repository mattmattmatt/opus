import kodi from 'kodi-ws';
import * as helpers from './helpers';

/*
 * action types
 */

export const SET_ACTIVE_PLAYER = 'SET_ACTIVE_PLAYER';
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

function refreshConnection(ip) {
    return (dispatch) => {
        const notificationCallback = () => { dispatch(fetchHostState()); };
        connection = kodi(ip, 9090);
        connection.then(c => {
            c.notification('Player.OnPause', notificationCallback);
            c.notification('Player.OnPlay', notificationCallback);
            c.notification('Player.OnStop', notificationCallback);
            c.notification('Player.OnSeek', notificationCallback);
            c.notification('Player.OnPropertyChanged', notificationCallback);
            dispatch(setConnection(c));
            dispatch(fetchHostState());
        });
    };
}

export function setConnection(connection) {
    return { type: SET_CONNECTION, connection };
}

export function fetchHostState() {
    return (dispatch, getState) => {
        var commandBatch = [
            ['Player.GetActivePlayers'],
            ['XBMC.GetInfoBooleans', { 'booleans': ['Player.Paused', 'Player.Playing'] }]
        ];
        helpers.sendKodiBatch(getState().connection, commandBatch).then(([activePlayers, infoBools]) => {
            let playbackState;

            if ((!infoBools['Player.Paused'] && !infoBools['Player.Playing']) || !activePlayers.length) {
                playbackState = PlaybackStates.STOPPED;
            } else if (infoBools['Player.Paused']) {
                playbackState = PlaybackStates.PAUSED;
            } else if (infoBools['Player.Playing']) {
                playbackState = PlaybackStates.PLAYING;
            } else {
                playbackState = PlaybackStates.UNKOWN;
            }
            dispatch(setPlaybackState(playbackState));
            dispatch(setActivePlayer(activePlayers[0]));
        }, kodiErrorHandler);
    };
}

export function setActivePlayer(player) {
    return { type: SET_ACTIVE_PLAYER, player };
}

export function setPlaybackState(playbackState) {
    return { type: SET_PLAYBACK_STATE, playbackState };
}

export function setSettings(settings) {
    return (dispatch) => {
        dispatch(refreshConnection(settings.ip, () => {}));
    };
}
