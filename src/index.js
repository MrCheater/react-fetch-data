'use strict';

var ReactDOMContainerInfo = require('react/lib/ReactDOMContainerInfo');
var ReactDefaultBatchingStrategy = require('react/lib/ReactDefaultBatchingStrategy');
var ReactElement = require('react/lib/ReactElement');
var ReactInstrumentation = require('react/lib/ReactInstrumentation');
var ReactMarkupChecksum = require('react/lib/ReactMarkupChecksum');
var ReactReconciler = require('react/lib/ReactReconciler');
var ReactServerBatchingStrategy = require('react/lib/ReactServerBatchingStrategy');
var ReactServerRenderingTransaction = require('react/lib/ReactServerRenderingTransaction');
var ReactUpdates = require('react/lib/ReactUpdates');
var emptyObject = require('fbjs/lib/emptyObject');
var instantiateReactComponent = require('react/lib/instantiateReactComponent');
var invariant = require('fbjs/lib/invariant');

var pendingTransactions = 0;

function callFetchData(componentInstance, promises) {
    if (componentInstance._instance && componentInstance._instance.fetchData) {
        var promise = componentInstance._instance.fetchData();
        if (promise && promise.then && promise.catch) {
            promises.push(promise);
        }
    }
    if (componentInstance._renderedComponent) {
        callFetchData(componentInstance._renderedComponent, promises);
    }
    if (componentInstance._renderedChildren) {
        for (var i in componentInstance._renderedChildren) {
            callFetchData(componentInstance._renderedChildren[i], promises);
        }
    }
}

function recursiveFetchData(componentInstance, transaction, markup, resolve, reject) {
    var promises = [];
    callFetchData(componentInstance, promises);
    if (promises.length > 0) {
        Promise.all(promises).then(function () {
            markup = ReactReconciler.mountComponent(componentInstance, transaction, null, ReactDOMContainerInfo(), emptyObject, 0 /* parentDebugID */);
            recursiveFetchData(componentInstance, transaction, markup, resolve, reject);
        }).catch(reject);
    } else {
        resolve(markup);
    }
}

function render(element) {
    var transaction;
    try {
        ReactUpdates.injection.injectBatchingStrategy(ReactServerBatchingStrategy);

        transaction = ReactServerRenderingTransaction.getPooled(true);

        pendingTransactions++;

        return transaction.perform(function () {
            var componentInstance = instantiateReactComponent(element, true);
            var markup = ReactReconciler.mountComponent(componentInstance, transaction, null, ReactDOMContainerInfo(), emptyObject, 0 /* parentDebugID */);
            if (process.env.NODE_ENV !== 'production') {
                ReactInstrumentation.debugTool.onUnmountComponent(componentInstance._debugID);
            }
            return new Promise(function (resolve, reject) {
                recursiveFetchData(componentInstance, transaction, markup, resolve, reject);
            });
        }, null);
    } finally {
        pendingTransactions--;
        ReactServerRenderingTransaction.release(transaction);
        if (!pendingTransactions) {
            ReactUpdates.injection.injectBatchingStrategy(ReactDefaultBatchingStrategy);
        }
    }
}

var IS_ALREADY_FETCHED_REQUEST = 'IS_ALREADY_FETCHED_REQUEST';
var IS_ALREADY_FETCHED_RESPONSE = 'IS_ALREADY_FETCHED_RESPONSE';

var isNodeJS = typeof window === 'undefined';

function isAlreadyFetched(uniqueFetchDataKey) {
    return {
        type: IS_ALREADY_FETCHED_REQUEST,
        uniqueFetchDataKey: uniqueFetchDataKey
    };
}

function reactFetchDataMiddleware(store) {
    if (isNodeJS) {
        store.fetchDataCache = {};
    }
    return function (next) {
        return function (action) {
            if (isNodeJS && action && action.type === IS_ALREADY_FETCHED_REQUEST) {
                if (store.fetchDataCache[action.uniqueFetchDataKey]) {
                    return next({
                        type : IS_ALREADY_FETCHED_RESPONSE,
                        status : true
                    });
                } else {
                    store.fetchDataCache[action.uniqueFetchDataKey] = true;
                    return next({
                        type : IS_ALREADY_FETCHED_RESPONSE,
                        status : false
                    });
                }
            }
            return next(action);
        };
    };
}

module.exports = {
    reactFetchDataMiddleware: reactFetchDataMiddleware,
    isAlreadyFetched: isAlreadyFetched,
    render: render
};