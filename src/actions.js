import kodi from 'kodi-ws';
import * as helpers from './helpers';
import { normalize, Schema, arrayOf } from 'normalizr';
import throttle from 'lodash.throttle';

const album = new Schema('albums', {
    idAttribute: 'albumid'
});
const artist = new Schema('artists', {
    idAttribute: 'artistid'
});
const song = new Schema('songs', {
    idAttribute: 'songid'
});

album.define({
  artists: arrayOf(artist),
});

song.define({
  artists: arrayOf(artist),
  album,
});

artist.define({});


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
export const SET_SECTION = 'SET_SECTION';

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

function generalNotificationCallback(dispatch) {
    return throttle(() => {
        dispatch(fetchHostState());
        setTimeout(() => {dispatch(fetchHostState());}, 500);
    }, 600);
}

function volumeNotificationCallback(dispatch) {
    return (notification) => {
        dispatch(setPlayerInfo({
            appProperties: {
                volume: notification.data.volume,
                muted: notification.data.muted,
            }
        }));
    };
}

function refreshConnection(ip) {
    const thunk = (dispatch) => {
        connection = kodi(ip, 9090);
        connection.then(c => {
            console.info('Socket connected.');
            c.notification('Player.OnPause', generalNotificationCallback(dispatch));
            c.notification('Player.OnPlay', generalNotificationCallback(dispatch));
            c.notification('Player.OnStop', generalNotificationCallback(dispatch));
            c.notification('Player.OnSeek', generalNotificationCallback(dispatch));
            c.notification('Player.OnPropertyChanged', generalNotificationCallback(dispatch));
            c.notification('Playlist.OnAdd', generalNotificationCallback(dispatch));
            c.notification('Playlist.OnRemove', generalNotificationCallback(dispatch));
            c.notification('Playlist.OnClear', generalNotificationCallback(dispatch));
            c.notification('VideoLibrary.OnUpdate', generalNotificationCallback(dispatch));
            c.notification('VideoLibrary.OnRemove', generalNotificationCallback(dispatch));
            c.notification('VideoLibrary.OnScanFinished', generalNotificationCallback(dispatch));
            c.notification('VideoLibrary.OnCleanFinished', generalNotificationCallback(dispatch));
            c.notification('AudioLibrary.OnUpdate', generalNotificationCallback(dispatch));
            c.notification('AudioLibrary.OnRemove', generalNotificationCallback(dispatch));
            c.notification('AudioLibrary.OnScanFinished', generalNotificationCallback(dispatch));
            c.notification('AudioLibrary.OnCleanFinished', generalNotificationCallback(dispatch));
            c.notification('Application.OnVolumeChanged', volumeNotificationCallback(dispatch));
            c.notification('System.OnWake', generalNotificationCallback(dispatch));
            c.on('error', (e) => {
                console.warn('Socket error, attempting reconnect.', e);
                dispatch(refreshConnection(ip));
            });
            c.on('close', () => {
                console.warn('Socket closed, attempting reconnect.');
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
            ['Application.GetProperties', {'properties': ['volume', 'muted', 'name']}],
            ['XBMC.GetInfoBooleans', { 'booleans': ['Player.Paused', 'Player.Playing'] }],
            ['Playlist.GetItems', { 'properties': ['title', 'album', 'artist', 'duration'], 'playlistid': 0 }],
            ['Playlist.GetItems', { 'properties': ['title', 'season', 'episode', 'showtitle', 'originaltitle', 'duration', 'description'], 'playlistid': 1 }]
        ];
        return helpers.sendKodiBatch(getState().connection, commandBatch).then(([activePlayers, appProperties, infoBools, audioPlaylistItems, videoPlaylistItems]) => {
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
            dispatch(setPlayerInfo({appProperties}));
            dispatch(setPlaylistItems(audioPlaylistItems.items, videoPlaylistItems.items));
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

export function setPlaylistItems(playlistItemsAudio, playlistItemsVideo) {
    return { type: SET_PLAYLIST_ITEMS, playlistItemsAudio, playlistItemsVideo };
}

export function updateCurrentTime() {
    return { type: UPDATE_CURRENT_IIME };
}

export function setPlayerInfo(data) {
    return { type: SET_PLAYER_INFO, data };
}

export function setSettings(settings) {
    return (dispatch) => {
        dispatch({ type: SET_SETTINGS, settings });
        dispatch(refreshConnection(settings.ip));
    };
}

export function setSection(sectionPath, sectionData) {
    return { type: SET_SECTION, sectionPath, sectionData };
}

export function navigateTo(path, updateUi) {
    return (dispatch, getState) => {
        switch (true) {
            case (/\/music$/).test(path):
                updateUi({ activeSection: path });
                helpers.sendKodiBatch(getState().connection, [
                    ['AudioLibrary.GetAlbums',
                        {
                            properties: ['playcount', 'artist', 'artistid', 'genre', 'rating', 'thumbnail', 'year', 'mood', 'style', 'title', 'displayartist'],
                            sort: { order: 'ascending', method: 'random', ignorearticle: true },
                            limits: { start: 0, end: 10 }
                        }
                    ],
                    ['AudioLibrary.GetArtists',
                        {
                            properties: ['thumbnail', 'fanart', 'born', 'formed', 'died', 'disbanded', 'yearsactive', 'mood', 'style', 'genre'],
                            sort: { order: 'ascending', method: 'random', ignorearticle: true },
                            limits: { start: 0, end: 10 }
                        }
                    ],
                ]).then(([albums, artists]) => {
                    albums = normalize(helpers.prepareAlbumsForNormalization(albums.albums, getState().settings.ip), arrayOf(album));
                    artists = normalize(helpers.prepareArtistsForNormalization(artists.artists, getState().settings.ip), arrayOf(artist));
                    dispatch(this.setSection(path, {albums, artists}));
                });
                break;
            case (/\/music\/albums$/).test(path):
                updateUi({ activeSection: path });
                helpers.sendKodiBatch(getState().connection, [
                    ['AudioLibrary.GetAlbums',
                        {
                            properties: ['playcount', 'artist', 'artistid', 'genre', 'rating', 'thumbnail', 'year', 'mood', 'style', 'title', 'displayartist'],
                            sort: { order: 'ascending', method: 'random', ignorearticle: true },
                        }
                    ],
                ]).then(([albums]) => {
                    albums = normalize(helpers.prepareAlbumsForNormalization(albums.albums, getState().settings.ip), arrayOf(album));
                    dispatch(this.setSection(path, {albums}));
                });
                break;
            case (/\/music\/artists$/).test(path):
                updateUi({ activeSection: path });
                helpers.sendKodiBatch(getState().connection, [
                    ['AudioLibrary.GetArtists',
                        {
                            properties: ['thumbnail', 'fanart', 'born', 'formed', 'died', 'disbanded', 'yearsactive', 'mood', 'style', 'genre'],
                            sort: { order: 'ascending', method: 'random', ignorearticle: true },
                        }
                    ],
                ]).then(([artists]) => {
                    artists = normalize(helpers.prepareArtistsForNormalization(artists.artists, getState().settings.ip), arrayOf(artist));
                    dispatch(this.setSection(path, {artists}));
                });
                break;
            case (/\/music\/artists\/(\d+)$/).test(path):
                updateUi({ activeSection: path });
                helpers.sendKodiBatch(getState().connection, [
                    ['AudioLibrary.GetSongs',
                        {
                            properties: ['title','disc','file','thumbnail','artist','artistid','displayartist',/*'albumartist', 'albumartistid',*/'album','albumid','lastplayed','track','year','duration'],
                            sort: { order: 'ascending', method: 'track', ignorearticle: true },
                            filter: { artistid: parseInt(path.split('/')[3], 10)}
                        }
                    ],
                ]).then(([songs]) => {
                    songs = normalize(helpers.prepareSongsForNormalization(songs.songs, getState().settings.ip), arrayOf(song));
                    dispatch(this.setSection(path, {songs}));
                });
                break;
            case (/\/music\/albums\/(\d+)$/).test(path):
                updateUi({ activeSection: path });
                helpers.sendKodiBatch(getState().connection, [
                    ['AudioLibrary.GetSongs',
                        {
                            properties: ['title','disc','file','thumbnail','artist','artistid','displayartist',/*'albumartist', 'albumartistid',*/'album','albumid','lastplayed','track','year','duration'],
                            sort: { order: 'ascending', method: 'track', ignorearticle: true },
                            filter: { albumid: parseInt(path.split('/')[3], 10)}
                        }
                    ],
                ]).then(([songs]) => {
                    songs = normalize(helpers.prepareSongsForNormalization(songs.songs, getState().settings.ip), arrayOf(song));
                    dispatch(this.setSection(path, {songs}));
                });
                break;
            default:
        }
    };
}
