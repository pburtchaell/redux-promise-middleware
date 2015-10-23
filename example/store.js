import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(
  require('./utils/middleware/promise')()
)(createStore);

export default function store(initialState) {
  const store = createStoreWithMiddleware(reducers, initialState);

  if (module.hot) {
    require('eventsource-polyfill');

    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      store.replaceReducer(reducers);
    });
  }

  if (NODE_ENV === 'development') {
    window.store = store.getState();
  }

  return store;
}
