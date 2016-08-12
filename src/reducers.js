import { combineReducers } from 'redux';
import * as actions from './actions';

const defaultHostState = {
    activePlayer: null,
    playerInfo: {}
};
function hostState(state = defaultHostState, action) {
    switch (action.type) {
        case actions.SET_ACTIVE_PLAYER: {
            return Object.assign({}, state, {activePlayer: action.player});
        }
        case actions.SET_PLAYER_INFO: {
            const hostState = Object.assign({}, state);
            hostState.playerInfo = Object.assign({}, action.playerProps, action.playerItem.item);
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
    connection
});

export default app;
