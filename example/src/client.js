import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { prepareStore } from './prepareStore';
import { AppController } from './AppController';

const store = prepareStore();

ReactDOM.render((
    <Provider store = {store}>
        <AppController/>
    </Provider>
), document.getElementById('app'));
