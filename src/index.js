import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'

const store = configureStore()


import {Opus} from './components/Main';

document.addEventListener("DOMContentLoaded", function(event) {
    const appElm = document.createElement('div');
    document.body.appendChild(appElm);

    ReactDOM.render(
        <Opus />,
        appElm
    );
});
