import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware()
)(createStore);

function configureStore(initialState) {
  return createStoreWithMiddleware(reducers, initialState);
}

const store = configureStore({});

export default store;
