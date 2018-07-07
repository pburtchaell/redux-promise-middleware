import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from '../../src';
import errorMiddleware from './middleware';
import { createLogger } from 'redux-logger';

const reducer = (state) => state;

// Custom error middleware should go before the promise middleware
const store = createStore(reducer, null, applyMiddleware(
  errorMiddleware,
  promiseMiddleware(),
  createLogger({ collapsed: true }),
));

export default store;
