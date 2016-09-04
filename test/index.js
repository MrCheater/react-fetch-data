import React from 'react';
import 'react-dom/server'; //Important require
import { Provider } from 'react-redux';
import { render } from '../src/index';
import { prepareStore } from '../example/src/prepareStore';
import { AppController } from '../example/src/AppController';
import chai from 'chai';
const { expect } = chai;

describe('React Fetch Data', function () {
    context('function "render"', function () {
        it('should be fetch data before render', function (done) {
            const store = prepareStore();

            render(
                <Provider store = {store}>
                    <AppController/>
                </Provider>
            ).then(
                (markup) => {
                    expect(markup).to.equal(
                        html`
                            <div>
                                AppView
                                <div>
                                    <div>
                                        ContainerView
                                        <div>
                                            test1
                                        </div>
                                    </div>
                                    <div>
                                        ContainerView
                                    <div>
                                        test2
                                    </div>
                                </div>
                            </div>
                        </div>`
                    );
                    done();
                }
            ).catch(
                (err) => done(err)
            );
        })
    });
})