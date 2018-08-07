import { createStore, applyMiddleware } from 'redux';
import { createPromise } from '../../src/index';
import { createLogger } from 'redux-logger';

const initialState = {
  isPending: true,
  image: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET-DOG-PENDING': return initialState;

    case 'GET-DOG-FULFILLED':
      return {
        isPending: false,
        image: action.payload.message,
      };

    default: return state;
  }
};

const store = createStore(reducer, {}, applyMiddleware(
  createPromise({
    promiseTypeDelimiter: '-'
  }),
  createLogger({ collapsed: true }),
));

export default store;
