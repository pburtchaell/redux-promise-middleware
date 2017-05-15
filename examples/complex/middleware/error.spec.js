import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from '../../../src/index';
import errorMiddleware from './error';

describe(`Example: ${errorMiddleware.name}`, () => {
  let store;

  const GLOBAL_ERROR_TYPE = 'GLOBAL_ERROR';
  const LOCAL_ERROR_TYPE = 'COLOCATED_ERROR';
  const DEFAULT_ERROR_MESSAGE = 'foo';

  // Default action for use in local error tests
  const DEFAULT_LOCAL_ERROR = {
    type: LOCAL_ERROR_TYPE,
    payload: Promise.reject(new Error(DEFAULT_ERROR_MESSAGE))
  };

  // Default action for use in global error tests
  const DEFAULT_GLOBAL_ERROR = {
    type: GLOBAL_ERROR_TYPE,
    payload: Promise.reject(new Error(DEFAULT_ERROR_MESSAGE))
  };

  const makeStore = () => applyMiddleware(
    errorMiddleware,
    promiseMiddleware()
  )(createStore)(() => null);

  beforeEach(() => {
    store = makeStore();
  });

  context('When action describes a "local" error:', () => {
    it('should ignore error', async () => {
      await store.dispatch(DEFAULT_LOCAL_ERROR).catch((error) => {
        expect(error.message).to.equal(DEFAULT_ERROR_MESSAGE);
      });
    });
  });

  context('When action descrives a "global" error:', () => {
    it('should catch error', async () => {
      await store.dispatch(DEFAULT_GLOBAL_ERROR).then(error => {
        expect(error.message).to.equal(DEFAULT_ERROR_MESSAGE);
      });
    });
  });
});
