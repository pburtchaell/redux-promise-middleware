import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from '../../../src';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import errorMiddleware from './middleware/error';

const store = createStore({}, {}, applyMiddleware(
  thunkMiddleware,

  // Custom error middleware should go before the promise middleware
  errorMiddleware,
  promiseMiddleware(),
  logger,
));

export default store;
