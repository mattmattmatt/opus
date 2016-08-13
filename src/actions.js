import kodi from 'kodi-ws';
import * as helpers from './helpers';

/*
 * action types
 */

export const SET_ACTIVE_PLAYER = 'SET_ACTIVE_PLAYER';
export const SET_PLAYBACK_STATE = 'SET_PLAYBACK_STATE';
export const SET_SETTINGS = 'SET_SETTINGS';
export const SET_CONNECTION = 'SET_CONNECTION';
export const SET_PLAYER_INFO = 'SET_PLAYER_INFO';
export const SET_PLAYLIST_ITEMS = 'SET_PLAYLIST_ITEMS';
export const UPDATE_CURRENT_IIME = 'UPDATE_CURRENT_IIME';

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
    const thunk = (dispatch) => {
        const notificationCallback = () => {
            dispatch(fetchHostState());
            setTimeout(() => {dispatch(fetchHostState());}, 250);
        };
        connection = kodi(ip, 9090);
        connection.then(c => {
            console.info('Socket connected.');
            c.notification('Player.OnPause', notificationCallback);
            c.notification('Player.OnPlay', notificationCallback);
            c.notification('Player.OnStop', notificationCallback);
            c.notification('Player.OnSeek', notificationCallback);
            c.notification('Player.OnPropertyChanged', notificationCallback);
            c.notification('Playlist.OnAdd', notificationCallback);
            c.notification('Playlist.OnRemove', notificationCallback);
            c.notification('Playlist.OnClear', notificationCallback);
            c.notification('VideoLibrary.OnUpdate', notificationCallback);
            c.notification('VideoLibrary.OnRemove', notificationCallback);
            c.notification('VideoLibrary.OnScanFinished', notificationCallback);
            c.notification('VideoLibrary.OnCleanFinished', notificationCallback);
            c.notification('AudioLibrary.OnUpdate', notificationCallback);
            c.notification('AudioLibrary.OnRemove', notificationCallback);
            c.notification('AudioLibrary.OnScanFinished', notificationCallback);
            c.notification('AudioLibrary.OnCleanFinished', notificationCallback);
            c.notification('System.OnWake', notificationCallback);
            c.on('error', (e) => {
                console.warn('Socket error, attemting reconnect.', e);
                dispatch(refreshConnection(ip));
            });
            c.on('close', () => {
                console.warn('Socket closed, attemting reconnect.');
                dispatch(refreshConnection(ip));
            });
            dispatch(setConnection(c));
            dispatch(fetchHostState());
        });
    };
    thunk.meta = {
        debounce: {
            time: 2000,
            key: 'my-thunk-action'
        }
    };
    return thunk;
}

export function setConnection(connection) {
    return { type: SET_CONNECTION, connection };
}

export function fetchHostState() {
    return (dispatch, getState) => {
        const commandBatch = [
            ['Player.GetActivePlayers'],
            ['XBMC.GetInfoBooleans', { 'booleans': ['Player.Paused', 'Player.Playing'] }],
            ['Playlist.GetItems', { 'properties': ['title', 'album', 'artist', 'duration'], 'playlistid': 0 }]
        ];
        return helpers.sendKodiBatch(getState().connection, commandBatch).then(([activePlayers, infoBools, playlistItems]) => {
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
            dispatch(setPlaylistItems(playlistItems.items));
        }, kodiErrorHandler).then(() => {
            if (getState().hostState.activePlayer) {
                return helpers.sendKodiBatch(getState().connection, [
                    ['Player.GetProperties', [getState().hostState.activePlayer.playerid, ['playlistid','speed','position','totaltime','time','percentage','shuffled','repeat','canrepeat','canshuffle','canseek','partymode']]],
                    ['Player.GetItem', [getState().hostState.activePlayer.playerid, ['title','thumbnail','file','artist','genre','year','rating','album','track','duration','playcount','dateadded','episode','artistid','albumid','tvshowid','fanart']]],
                ]).then((data) => {
                    dispatch(setPlayerInfo(data));
                    dispatch(updateCurrentTime());
                });
            } else {
                dispatch(setPlayerInfo());
            }
        });
    };
}

export function setActivePlayer(player) {
    return { type: SET_ACTIVE_PLAYER, player };
}

export function setPlaybackState(playbackState) {
    return { type: SET_PLAYBACK_STATE, playbackState };
}

export function setPlaylistItems(playlistItems) {
    return { type: SET_PLAYLIST_ITEMS, playlistItems };
}

export function updateCurrentTime() {
    return { type: UPDATE_CURRENT_IIME };
}

function setPlayerInfo(data) {
    return { type: SET_PLAYER_INFO, data };
}

export function setSettings(settings) {
    return (dispatch) => {
        dispatch({ type: SET_SETTINGS, settings });
        dispatch(refreshConnection(settings.ip));
    };
}
