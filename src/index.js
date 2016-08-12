import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
// import createLogger from 'redux-logger';
// const loggerMiddleware = createLogger();
import appReducer from './reducers';
import App from './App';
import './styles/index.css';

let store = createStore(appReducer, window.devToolsExtension && window.devToolsExtension(), applyMiddleware(thunkMiddleware/*, loggerMiddleware*/));

// import * as actions from './actions';

// Dispatch some actions
// store.dispatch(refreshState());
// store.dispatch(setPlaybackState(PlaybackStates.PLAYING));
// store.dispatch(setPlaybackState(PlaybackStates.PAUSED));
// store.dispatch(setPlaybackState());
// store.dispatch(actions.setSettings({ip: '192.168.1.140'}));
// store.dispatch(actions.fetchHostState());

render((
    <Provider store={store}>
        <App />
    </Provider>
), window.document.getElementById('root'));
