import { combineReducers } from 'redux';
import * as actions from './actions';
import moment from 'moment';
import { reducer as uiReducer } from 'redux-ui';

const defaultHostState = {
    activePlayer: null,
    playerInfo: {
        lastUpdated: 0,
        timedelta: 0
    },
    playlistItemsAudio: [],
    playlistItemsVideo: []
};
function hostState(state = defaultHostState, action) {
    switch (action.type) {
        case actions.SET_ACTIVE_PLAYER: {
            return Object.assign({}, state, {activePlayer: action.player});
        }
        case actions.SET_PLAYER_INFO: {
            let hostState = Object.assign({}, state);
            if (action.data) {
                const [playerProps, playerItem] = action.data;
                hostState.playerInfo = Object.assign({}, playerProps, playerItem.item, { lastUpdated: new Date().getTime() });
                hostState.playerInfo.time = moment.duration(hostState.playerInfo.time).asSeconds();
                hostState.playerInfo.totaltime = moment.duration(hostState.playerInfo.totaltime).asSeconds();
            } else {
                hostState.playerInfo = defaultHostState.playerInfo;
            }
            return hostState;
        }
        case actions.UPDATE_CURRENT_IIME: {
            const hostState = Object.assign({}, state);
            hostState.playerInfo.timedelta = moment.duration((new Date().getTime() - hostState.playerInfo.lastUpdated), 'ms').asSeconds();
            return hostState;
        }
        case actions.SET_PLAYLIST_ITEMS: {
            const hostState = Object.assign({}, state);
            hostState.playlistItemsAudio = (action.playlistItemsAudio || []).map((item) => {
                return {
                    primaryText: item.title || '',
                    secondaryText: item.artist || '',
                };
            });
            hostState.playlistItemsVideo = (action.playlistItemsVideo || []).map((item) => {
                return {
                    primaryText: item.title || '',
                    secondaryText: item.showtitle ?`${item.season}x${item.episode} – ${item.showtitle}` : '',
                };
            });
            return hostState;
        }
        default:
            return state;
    }
}

function settings(state = {}, action) {
    switch (action.type) {
        case actions.SET_SETTINGS:
            return Object.assign({}, state, action.settings);
        default:
            return state;
    }
}

const defaultSectionState = {
    sectionPath: '/',
    sectionData: {}
};
function section(state = defaultSectionState, action) {
    switch (action.type) {
        case actions.SET_SECTION:{
            const { sectionPath, sectionData} = action;
            return {
                sectionPath,
                sectionData
            };
        }
        default:
            return state;
    }
}

function connection(state = {}, action) {
    switch (action.type) {
        case actions.SET_CONNECTION:
            return action.connection;
        default:
            return state;
    }
}

function playbackState(state = actions.PlaybackStates.UNKOWN, action) {
    switch (action.type) {
        case actions.SET_PLAYBACK_STATE:
            return action.playbackState || state;
        default:
            return state;
    }
}

const app = combineReducers({
    hostState,
    playbackState,
    settings,
    connection,
    section,
    ui: uiReducer
});

export default app;
