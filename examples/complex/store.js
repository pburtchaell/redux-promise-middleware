import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import errorMiddleware from './middleware/error';
import loggerMiddleware from './middleware/logger';

const store = createStore(reducers, {}, applyMiddleware(
  thunkMiddleware,
  errorMiddleware,
  promiseMiddleware(),
  loggerMiddleware
));

export default store;
