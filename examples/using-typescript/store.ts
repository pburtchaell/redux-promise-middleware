import { createStore, Reducer, Store, applyMiddleware } from 'redux';
import promise, { FluxStandardAction } from 'redux-promise-middleware';

export interface State {
  isPending: boolean;
  image?: string;
}

const defaultState = {
  isPending: true,
};

const defaultReducer: Reducer = (state: State = defaultState, action: FluxStandardAction) => {
  switch (action.type) {
    case 'GET_DOG_FULFILLED':
      return {
        isPending: false,
        image: action.payload.message,
      };

    default: return state;
  }
};

const store: Store = createStore(defaultReducer, {}, applyMiddleware(promise));

export default store;
