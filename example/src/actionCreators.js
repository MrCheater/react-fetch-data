import { EAction } from './EAction';
import { isAlreadyFetched } from '../../src/index';

export const actionCreators = {
    containerFetchDataStart : (id) => ({
        type : EAction.FETCH_DATA_CONTAINER_START,
        id
    }),
    containerFetchDataComplete : (id) => ({
        type : EAction.FETCH_DATA_CONTAINER_COMPLETE,
        id
    }),
    containerFetchData : (id) => {
        return (dispatch) => {
            if(dispatch(isAlreadyFetched('containerFetchData' + id)).status) {
                return;
            }
            dispatch(actionCreators.containerFetchDataStart(id));
            return new Promise(function (resolve, reject) {
                setTimeout(() => {
                    dispatch(actionCreators.containerFetchDataComplete(id));
                    resolve();
                }, 500);
            });
        }
    },
    appFetchDataStart : () => ({
        type : EAction.FETCH_DATA_APP_START
    }),
    appFetchDataComplete : () => ({
        type : EAction.FETCH_DATA_APP_COMPLETE
    }),
    appFetchData : () => {
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
};
