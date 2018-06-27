import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from '../../src/index';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_POST_PENDING':
      return {
        isPending: true,
      };

    case 'GET_POST_FULFILLED':
      return {
        body: action.payload.body,
      };

    default: return state;
  }
};

const store = createStore(reducer, {}, applyMiddleware(
  thunkMiddleware,
  promiseMiddleware(),
  logger,
));

export default store;
