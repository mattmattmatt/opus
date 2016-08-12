import { combineReducers } from 'redux';

import * as actions from './actions';

function selectedReddit(state = 'reactjs', action) {
    switch (action.type) {
    case REQUEST_PLAY_STATUS:
        return action.reddit
    default:
        return state
    }
}

function didRecieveCurrentStatus(state = 'unknown', action) {
    switch (action.type) {
    case RECIEVE_PLAY_STATUS:
        return action.status
    default:
        return state
    }
}

function posts(state = {
    isFetching: false,
    didInvalidate: false,
    items: []
}, action) {
    switch (action.type) {
    case INVALIDATE_REDDIT:
        return Object.assign({}, state, {
            didInvalidate: true
        })
    case REQUEST_POSTS:
        return Object.assign({}, state, {
            isFetching: true,
            didInvalidate: false
        })
    case RECEIVE_POSTS:
        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate: false,
            items: action.posts,
            lastUpdated: action.receivedAt
        })
    default:
        return state
    }
}

function postsByReddit(state = {}, action) {
    switch (action.type) {
    case INVALIDATE_REDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
        return Object.assign({}, state, {
        [action.reddit]: posts(state[action.reddit], action)
        })
    default:
        return state
    }
}

const rootReducer = combineReducers({
    didRecieveCurrentStatus: didRecieveCurrentStatus,
});

export default rootReducer