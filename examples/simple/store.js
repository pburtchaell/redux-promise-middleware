/* eslint-disable no-extra-semi, no-unreachable, semi */

import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_POST_PENDING':
      return {
        isPending: true
      };

    case 'GET_POST_FULFILLED':
      return {
        message: action.payload.body // The message body of the post
      };

    case 'GET_POST_REJECTED':
      return {
        reason: action.payload.message, // The error reason
        error: true
      };

    default:
      return state;
  };
}

const store = createStore(reducer, {}, applyMiddleware(
  thunkMiddleware,
  promiseMiddleware()
));

export default store;
