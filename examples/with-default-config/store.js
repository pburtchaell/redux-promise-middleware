import { createStore, applyMiddleware } from 'redux';
import reduxPromise from '../../src/index';
import { createLogger } from 'redux-logger';

const initialState = {
  isPending: true,
  image: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_DOG_PENDING': return initialState;

    case 'GET_DOG_FULFILLED':
      return {
        isPending: false,
        image: action.payload.message,
      };

    default: return state;
  }
};

const store = createStore(reducer, {}, applyMiddleware(
  reduxPromise,
  createLogger({ collapsed: true }),
));

export default store;
