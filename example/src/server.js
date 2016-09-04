import React from 'react';
import 'react-dom/server'; //Important require
import { Provider } from 'react-redux';
import { render } from '../../src/index';
import { prepareStore } from './prepareStore';
import { AppController } from './AppController';

const store = prepareStore();

render(
    <Provider store = {store}>
        <AppController/>
    </Provider>
).then(
    markup => console.log(markup)
).catch(
    e => console.error(e)
);
