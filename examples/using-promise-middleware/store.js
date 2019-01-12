import { createStore, applyMiddleware } from 'redux';
import promise from '../../src/index';
import { createLogger } from 'redux-logger';

const defaultState = {
  isPending: true,
  image: null,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'GET_DOG_PENDING': return defaultState;

    case 'GET_DOG_FULFILLED':
      return {
        isPending: false,
        image: action.payload.message,
      };

    default: return state;
  }
};

const store = createStore(reducer, {}, applyMiddleware(
  promise,
  createLogger({ collapsed: true }),
));

export default store;
