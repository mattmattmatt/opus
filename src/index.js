import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
// import createLogger from 'redux-logger';
import appReducer from './reducers';
import App from './App';
import './index.css';

// const loggerMiddleware = createLogger();
let store = createStore(appReducer, applyMiddleware(thunkMiddleware/*, loggerMiddleware*/));

// import * as actions from './actions';

// Dispatch some actions
// store.dispatch(refreshState());
// store.dispatch(setPlaybackState(PlaybackStates.PLAYING));
// store.dispatch(setPlaybackState(PlaybackStates.PAUSED));
// store.dispatch(setPlaybackState());
// store.dispatch(actions.setSettings({ip: '192.168.1.140'}));
// store.dispatch(actions.fetchHostState());

ReactDOM.render((
    <Provider store={store}>
        <App  store={store} />
    </Provider>
), window.document.getElementById('root'));
