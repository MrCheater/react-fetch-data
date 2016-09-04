import { EAction } from './EAction';

const initialState = {
    app : {

    },
    containers : {
        test1 : {
            id : 'test1'
        },
        test2 : {
            id : 'test2'
        }
    }
};

export function reducer(state = initialState, action) {
    switch(action.type) {
        case EAction.FETCH_DATA_APP_COMPLETE:
            return {
                ...state,
                app : {
                    ...state.app,
                    data : {}
                }
            };
        case EAction.FETCH_DATA_CONTAINER_COMPLETE:
            return {
                ...state,
                containers : {
                    ...state.containers,
                    [action.id] : {
                        ...state.containers[action.id],
                        data : {}
                    }
                }
            };
        default:
            return state;
    }
}