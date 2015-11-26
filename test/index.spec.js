import chai from 'chai';
import configureStore from 'redux-mock-store';
import promiseMiddleware from '../src/index';

describe('promise middleware', () => {
  const nextHandler = promiseMiddleware();

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler);
    chai.assert.strictEqual(nextHandler.length, 1);
  });

  describe('handle action', () => {
    const middlewares = [promiseMiddleware()];
    const mockStore = configureStore(middlewares);
    const mockActionWithoutPromise = { type: 'GET_POST' };
    const mockRejectedAction = {
      type: 'GET_POST',
      payload: {
        promise: Promise.reject(new Error())
      }
    };
    const mockFulfilledAction = {
      type: 'GET_POST',
      payload: {
        promise: Promise.resolve({})
      }
    };

    const pendingAction = {
      type: 'GET_POST_PENDING'
    };
    const rejectedAction = {
      type: 'GET_POST_REJECTED',
      error: true,
      payload: new Error()
    };
    const fulfilledAction = {
      type: 'GET_POST_FULFILLED',
      payload: {}
    };

    it('must pass action to next if not a promise', done => {
      const store = mockStore({}, [mockActionWithoutPromise], done);
      store.dispatch(mockActionWithoutPromise);
    });

    it('must dispatch rejected action if promise is rejected', done => {
      const store = mockStore({}, [pendingAction, rejectedAction], done);
      store.dispatch(mockRejectedAction);
    });

    it('must dispatch fulfilled action if promise is fulfilled', done => {
      const store = mockStore({}, [pendingAction, fulfilledAction], done);
      store.dispatch(mockFulfilledAction);
    });
  });
});
