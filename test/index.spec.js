import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { createStore, applyMiddleware } from 'redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware from '../src/index';
chai.use(sinonChai);

describe('Redux Promise Middleware:', () => {
  const nextHandler = promiseMiddleware();

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler);
    chai.assert.strictEqual(nextHandler.length, 1);
  });

  /*
    Make two fake middleware to surround promiseMiddleware in chain,
    Give both of them a spy property to assert on their usage
   */
  // first middleware mimics redux-thunk
  function firstMiddlewareThunk(ref, next) {
    this.spy = sinon.spy((action) =>
      typeof action === 'function'
        ? action(ref.dispatch, ref.getState)
        : next(action)
    );
    return this.spy;
  }
  // final middleware returns some dummy data
  const lastMiddlewareReturn = { test: 'value' };
  function lastMiddleware(next) {
    this.spy = sinon.spy((action) => {
      next(action);
      return lastMiddlewareReturn;
    });
    return this.spy;
  }

  /*
    Function for creating a dumb store using fake middleware stack
   */
  const makeStore = (config) => applyMiddleware(
    ref => next => firstMiddlewareThunk.call(firstMiddlewareThunk, ref, next),
    promiseMiddleware(config),
    () => next => lastMiddleware.call(lastMiddleware, next)
  )(createStore)(()=>null);

  let store;
  beforeEach(()=> {
    store = makeStore();
  });

  afterEach(()=> {
    firstMiddlewareThunk.spy.reset();
    lastMiddleware.spy.reset();
  });

  context('When Action is Not a Promise:', () => {
    const mockAction = { type: 'NOT_PROMISE' };

    it('invokes next with the action', () => {
      store.dispatch(mockAction);
      expect(lastMiddleware.spy).to.have.been.calledWith(mockAction);
    });

    it('returns the return from next middleware', () => {
      expect(store.dispatch(mockAction)).to.equal(lastMiddlewareReturn);
    });

    it('doesnt dispatch any other actions', done => {
      const mockStore = configureStore([promiseMiddleware()]);
      mockStore({}, [mockAction], done).dispatch(mockAction);
    });
  });

  context('When Action Has Promise Payload:', () => {
    let promiseAction;
    let pendingAction;
    beforeEach(()=> {
      promiseAction = {
        type: 'HAS_PROMISE',
        payload: {
          promise: Promise.resolve()
        }
      };
      pendingAction = {
        type: `${promiseAction.type}_PENDING`
      };
    });

    it('dispatches a pending action', () => {
      store.dispatch(promiseAction);
      expect(lastMiddleware.spy).to.have.been.calledWith(pendingAction);
    });

    it('optionally contains optimistic update payload from data property', () => {
      const optimisticUpdate = { fake: 'data' };
      promiseAction.payload.data = optimisticUpdate;
      pendingAction.payload = optimisticUpdate;
      store.dispatch(promiseAction);
      expect(lastMiddleware.spy).to.have.been.calledWith(pendingAction);
    });

    it('optionally contains meta data', () => {
      const meta = { fake: 'data' };
      promiseAction.meta = meta;
      pendingAction.meta = meta;
      store.dispatch(promiseAction);
      expect(lastMiddleware.spy).to.have.been.calledWith(pendingAction);
    });

    it('allows customisation of global pending action.type', () => {
      const customPrefix = 'PENDIDDLE';
      store = makeStore({
        promiseTypeSuffixes: [ customPrefix, '', '' ]
      });
      pendingAction.type = `${promiseAction.type}_${customPrefix}`;
      store.dispatch(promiseAction);
      expect(lastMiddleware.spy).to.have.been.calledWith(pendingAction);
    });

    it('allows customisation of pending action.type per dispatch', () => {
      const customPrefix = 'PENDOODDLE';
      const actionMeta = { promiseTypeSuffixes: [ customPrefix, '', '' ] };
      promiseAction.meta = actionMeta;
      pendingAction.type = `${promiseAction.type}_${customPrefix}`;
      // FIXME: Test leak, should the promiseTypeSuffixes be in other actions?
      pendingAction.meta = actionMeta;
      store.dispatch(promiseAction);
      expect(lastMiddleware.spy).to.have.been.calledWith(pendingAction);
    });

    it('returns the originally dispatched action', () => {
      expect(store.dispatch(promiseAction)).to.eql(promiseAction);
    });

    context('When Promise Rejects:', ()=> {
      let promiseAction;
      let rejectedAction;
      let rejectValue;
      beforeEach(()=> {
        rejectValue = { test: 'resolved value' };
        promiseAction = {
          type: 'HAS_REJECTING_PROMISE',
          payload: {
            promise: Promise.reject(rejectValue)
          }
        };
        rejectedAction = {
          type: `${promiseAction.type}_REJECTED`,
          error: true,
          payload: rejectValue
        };
      });

      it('re-dispatches rejected action with error and payload from error', async () => {
        await store.dispatch(promiseAction).payload.promise;
        expect(lastMiddleware.spy).to.have.been.calledWith(rejectedAction);
      });

      it('works when resolve is null', async () => {
        promiseAction.payload.promise = Promise.reject(null);
        rejectedAction = {
          type: `${promiseAction.type}_REJECTED`,
          error: true
        };
        await store.dispatch(promiseAction).payload.promise;
        expect(lastMiddleware.spy).to.have.been.calledWith(rejectedAction);
      });

      it('persists meta from original action');
      it('allows promise to resolve a new action object and merge into original');
      it('allows promise to resolve thunk, pre-bound to the rejected action');
      it('the returned action.payload.promise resolves the rejected action');
      it('allows customisation of global rejected action.type');
      it('allows customisation of rejected action.type per dispatch');
    });

    context('When Promise Resolves', ()=> {
      it('re-dispatches a fulfilled action with payload from promise');
      it('works when resolve is null');
      it('persists meta from original action');
      it('allows promise to resolve a new action object and merge into original');
      it('allows promise to resolve thunk, pre-bound to the resolved action');
      it('the returned action.payload.promise resolves the fulfilled action');
      it('allows customisation of global fulfilled action.type');
      it('allows customisation of fulfilled action.type per dispatch');
    });
  });

  describe.skip('handle action', () => {
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
