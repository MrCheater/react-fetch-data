import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './actionCreators';
import { AppView } from './AppView';

export const AppController = connect(
    state => ({
        app        : state.app,
        containers : state.containers
    }),
    dispatch => bindActionCreators(actionCreators, dispatch)
)(AppView);