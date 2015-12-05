import chai from 'chai';
import configureStore from 'redux-mock-store';
import promiseMiddleware from '../src/index';

describe('Redux Promise Middleware', () => {
  const nextHandler = promiseMiddleware();

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler);
    chai.assert.strictEqual(nextHandler.length, 1);
  });

  context('When Action is Not a Promise', ()=> {
    it('invokes next with the action');
    it('returns the return from next middleware');
    it('doesnt dispatch any other actions');
  });

  context('When Action Has Promise Payload', ()=> {
    it('dispatches a pending action');
    it('optionally contains optimistic update payload from data property');
    it('optionally contains meta data');
    it('allows customisation of global pending action.type');
    it('allows customisation of pending action.type per dispatch');
    it('returns the originally dispatched action');

    context('When Promise Rejects', ()=> {
      it('dispatches a rejected action with error flag and payload from error');
      it('works when resolve is null');
      it('persists meta from original action');
      it('allows promise to resolve a new action object and merge into original');
      it('allows promise to resolve thunk, pre-bound to the rejected action');
      it('the returned action.payload.promise resolves the rejected action');
      it('allows customisation of global rejected action.type');
      it('allows customisation of rejected action.type per dispatch');
    });

    context('When Promise Resolves', ()=> {
      it('dispatches a fulfilled action with payload from promise');
      it('works when resolve is null');
      it('persists meta from original action');
      it('allows promise to resolve a new action object and merge into original');
      it('allows promise to resolve thunk, pre-bound to the resolved action');
      it('the returned action.payload.promise resolves the fulfilled action');
      it('allows customisation of global fulfilled action.type');
      it('allows customisation of fulfilled action.type per dispatch');
    });
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
