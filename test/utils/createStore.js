import { createStore as createReduxStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import spyMiddleware from './spyMiddleware';

/*
 * Function: createStore
 * Description: Creates a store for testing that includes
 * spies/mock functions to see dispatched actions.
 */
const createStore = (config, restMiddlewares = []) => {
  const firstSpy = jest.fn();
  const lastSpy = jest.fn();

  const middlewares = [
    spyMiddleware(firstSpy),
    promiseMiddleware(config),
    spyMiddleware(lastSpy),
    ...restMiddlewares,
  ];

  const store = applyMiddleware(...middlewares)(createReduxStore)(() => null);

  return {
    dispatch: store.dispatch,
    getState: store.getState,
    firstSpy,
    lastSpy,
  };
};

export default createStore;
