React fetch data in server before render.

* Simple
* Support Async/Await syntax
* Support Redux
* Recursive (fetchData for all children)

Usage:
```javascript
//server.js
import 'react-dom/server'; //Important require
import { render } from 'react-fetch-data';

function handler(req, res) {
    render(
        <Provider store = {store}>
            <AppController/>
        </Provider>
    ).then(
        (markup) => {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(markup);
        }
    ).catch(
        (err) => {        
            res.writeHead(400, {'Content-Type':'text/html'});
            res.end(err.toString());  
        }
    )
}
```

Add "fetchData" to React.Component-Lifecycle on server-side

```javascript
//AppView.js - React.Component
import React from 'react';

export class AppView extends React.Component {
    fetchData = () => {
        return this.props.appFetchData();
    };

    componentDidMount() {
        this.fetchData();
    }

    render() {
        return (
            <div>
                AppView
                {this.props.app.data ? (
                    <div>
                        {JSON.stringify(this.props.app.data)}
                    </div>
                ) : null}
            </div>
        );
    }
}
```

Prepare store (add FetchData-Middleware)
```javascript
//prepareStore.js
import { reducer } from './reducer';
import { applyMiddleware, createStore } from 'redux';
import { reactFetchDataMiddleware } from 'react-fetch-data';
import thunk from 'redux-thunk';

export function prepareStore() {
    return createStore(reducer, applyMiddleware(thunk, reactFetchDataMiddleware));
}
```

Write action-creator for fetchData:
```javascript
//actionCreators.js
import { isAlreadyFetched } from 'react-fetch-data';

function appFetchData () => {
    return (dispatch) => {
        if(dispatch(isAlreadyFetched('appFetchData')).status) {
            return;
        }
        dispatch(actionCreators.appFetchDataStart());
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                dispatch(actionCreators.appFetchDataComplete());
                resolve();
            }, 500);
        });
    }
}
```
On Server:
* First call "appFetchData" should be return unique promise
* Other calls "appFetchData" should be return undefined

On Client:
* Any call "appFetchData" should be return new promise

**More details:** https://github.com/MrCheater/react-fetch-data/example/src

**For Developers**
```bash
npm install -g mocha
npm install -g babel-cli
npm install -g webpack
npm run test
npm build:example
npm run example
example/dist/index.html 
```