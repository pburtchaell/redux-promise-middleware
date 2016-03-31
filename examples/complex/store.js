import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';

const store = createStore(reducers, {}, applyMiddleware(
  thunkMiddleware,
  promiseMiddleware({
    // optional config
  })
));

export default store;
