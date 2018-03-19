import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import errorMiddleware from './middleware/error';
import logger from 'redux-logger';

const store = createStore(reducers, {}, applyMiddleware(
  thunkMiddleware,

  // Custom error middleware should go before the promise middleware
  errorMiddleware,
  promiseMiddleware(),
  logger,
));

export default store;
