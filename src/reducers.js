import { combineReducers } from 'redux';
import { SET_HOST_STATE, SET_PLAYBACK_STATE, SET_SETTINGS, SET_CONNECTION, PlaybackStates } from './actions';

function hostState(state = {}, action) {
    switch (action.type) {
        case SET_HOST_STATE:
            console.log('SET_HOST_STATE', state, action);
            return state;
        default:
            return state;
    }
}

function settings(state = {}, action) {
    switch (action.type) {
        case SET_SETTINGS:
            return Object.assign({}, state, action.settings);
        case SET_CONNECTION:
            return Object.assign({}, state, action.connection);
        default:
            return state;
    }
}

function playbackState(state = PlaybackStates.UNKOWN, action) {
    switch (action.type) {
        case SET_PLAYBACK_STATE:
            return action.playbackState || state;
        default:
            return state;
    }
}

const app = combineReducers({
    hostState,
    playbackState,
    settings
});

export default app;
