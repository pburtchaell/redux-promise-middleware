/* eslint-disable no-extra-semi, no-unreachable, semi */
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ALL_PENDING':
      return {
        isPending: true,
      };

    case 'GET_ALL_FULFILLED':
      return {
        isPending: false,
      };

    default:
      return state;
  };
}

const store = createStore(reducer, {}, applyMiddleware(
  thunkMiddleware,
  promiseMiddleware(),
  logger,
));

export default store;
