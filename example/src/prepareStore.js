import { reducer } from './reducer';
import { applyMiddleware, createStore } from 'redux';
import { reactFetchDataMiddleware } from '../../src/index';
import thunk from 'redux-thunk';

export function prepareStore() {
    return createStore(reducer, applyMiddleware(thunk, reactFetchDataMiddleware));
}


