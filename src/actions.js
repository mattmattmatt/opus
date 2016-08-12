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
        const notificationCallback = () => {
            dispatch(fetchHostState());
            setTimeout(() => {dispatch(fetchHostState());}, 250); 
        };
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
                });
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

function setPlayerInfo(data) {
    return { type: SET_PLAYER_INFO, data };
}

export function setSettings(settings) {
    return (dispatch) => {
        dispatch(refreshConnection(settings.ip));
        dispatch({ type: SET_SETTINGS, settings });
    };
}
