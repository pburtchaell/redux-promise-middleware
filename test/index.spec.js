/* eslint no-unused-vars: 0, no-unused-expressions: 0, no-shadow: 0 */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Bluebird from 'bluebird';
import { createStore, applyMiddleware } from 'redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware from '../src/index';

chai.use(sinonChai);

describe('Redux Promise Middleware:', () => {
  let store;
  let promiseAction;
  let pendingAction;
  let fulfilledAction;
  let rejectedAction;

  const promiseValue = 'foo';
  const promiseReason = 'bar';
  const customPrefix = 'CUSTOM';
  const optimisticUpdateData = { foo: true };
  const metaData = { bar: true };
  const lastMiddlewareData = { baz: true };

  const defaultPromiseAction = {
    type: 'ACTION',
    payload: {
      promise: Promise.resolve(promiseValue)
    }
  };

  const defaultPendingAction = {
    type: `${defaultPromiseAction.type}_PENDING`
  };

  const defaultFulfilledAction = {
    type: `${defaultPromiseAction.type}_FULFILLED`,
    payload: promiseValue
  };

  const defaultRejectedAction = {
    type: `${defaultPromiseAction.type}_REJECTED`,
    error: true,
    payload: promiseReason
  };

  const nextHandler = promiseMiddleware();

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler);
    chai.assert.strictEqual(nextHandler.length, 1);
  });

  /**
   * Make two fake middleware to surround promiseMiddleware in chain,
   * Give both of them a spy property to assert on their usage
   */
  // first middleware mimics redux-thunk
  function firstMiddlewareThunk(ref, next) {
    this.spy = sinon.spy((action) => {
      if (typeof action === 'function') {
        return action(ref.dispatch, ref.getState);
      }

      return next(action);
    });

    return this.spy;
  }

  // final middleware returns the action merged with dummy data
  function lastMiddlewareModfies(next) {
    this.spy = sinon.spy(action => {
      next(action);

      return {
        ...action,
        ...lastMiddlewareData
      };
    });

    return this.spy;
  }

  /*
   * Function for creating a dumb store using fake middleware stack
   */
  const makeStore = (config) => applyMiddleware(
    ref => next => firstMiddlewareThunk.call(firstMiddlewareThunk, ref, next),
    promiseMiddleware(config),
    () => next => lastMiddlewareModfies.call(lastMiddlewareModfies, next)
  )(createStore)(() => null);

  beforeEach(() => {
    store = makeStore();
  });

  afterEach(() => {
    firstMiddlewareThunk.spy.reset();
    lastMiddlewareModfies.spy.reset();
  });


  context('When action is not a string:', () => {
    it('will throw error from redux for action without type', () => {
      const mockAction = {
        payload: defaultPromiseAction.payload
      };

      expect(() => store.dispatch(mockAction)).to.throw;
    });

    it('will ignore action when it\'s type is not string', () => {
      const mockAction = {
        type: Symbol('ACTION'),
        payload: defaultPromiseAction.payload
      };

      store.dispatch(mockAction);

      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(mockAction);
    });
  });

  context('When action is not a promise:', () => {
    const mockAction = { type: 'ACTION' };

    it('invokes next with the action', () => {
      store.dispatch(mockAction);
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(mockAction);
    });

    it('returns the return from next middleware', () => {
      expect(store.dispatch(mockAction)).to.eql({
        ...mockAction,
        ...lastMiddlewareData
      });
    });

    it('does not dispatch any other actions', done => {
      const mockStore = configureStore([promiseMiddleware()]);
      mockStore({}, [mockAction], done).dispatch(mockAction);
    });
  });

  context('When action has promise payload:', () => {
    beforeEach(() => {
      promiseAction = defaultPromiseAction;
      pendingAction = defaultPendingAction;
      rejectedAction = defaultRejectedAction;
      fulfilledAction = defaultFulfilledAction;
    });

    afterEach(() => {
      promiseAction = defaultPromiseAction;
      pendingAction = defaultPendingAction;
      rejectedAction = defaultRejectedAction;
      fulfilledAction = defaultFulfilledAction;
    });

    it('dispatches a pending action for explicit promise payload', () => {
      store.dispatch(promiseAction);
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    it('dispatches a pending action for implicit promise payload', () => {
      store.dispatch({
        type: promiseAction.type,
        payload: promiseAction.payload.promise
      });

      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    /**
     * If the promise action is dispatched with a data property, that property and value
     * must be included in the pending action the middleware dispatches. This property
     * is used for optimistic updates.
     */
    it('pending action optionally contains optimistic update payload from data property', () => {
      promiseAction.payload.data = optimisticUpdateData;
      pendingAction.payload = optimisticUpdateData;

      store.dispatch(promiseAction);
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    /**
     * If the promise action is dispatched with a meta property, that property and value
     * must be included in the pending action the middleware dispatches.
     */
    it('pending action optionally contains meta property', () => {
      promiseAction.meta = metaData;
      pendingAction.meta = metaData;

      store.dispatch(promiseAction);
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    /**
     * The middleware should allow global custom action types that are included
     * in the config when the middleware is constructed.
     */
    it('allows global customisation of action.type suffixes', () => {
      store = makeStore({ promiseTypeSuffixes: [customPrefix, '', ''] });
      store.dispatch(promiseAction);

      pendingAction.type = `${promiseAction.type}_${customPrefix}`;

      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    /**
     * The middleware should allow custom action type suffix(es) per dispatch
     * if the suffix is included in the meta of the action.
     */
    it('allows local customisation of action.type suffixes', () => {
      const actionMeta = { promiseTypeSuffixes: [customPrefix, '', ''] };

      store.dispatch({
        ...promiseAction,
        meta: actionMeta
      });

      pendingAction.type = `${promiseAction.type}_${customPrefix}`;
      pendingAction.meta = actionMeta;

      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });
  });

  context('When promise is fulfilled:', () => {
    beforeEach(() => {
      promiseAction = {
        type: defaultPromiseAction.type,
        payload: Promise.resolve(promiseValue)
      };

      fulfilledAction = defaultFulfilledAction;
    });

    it('propagates the original promise', done => {
      const actionDispatched = store.dispatch({
        type: defaultPromiseAction.type,
        payload: Bluebird.resolve(promiseValue)
      });

      // Expect that the promise returned has bluebird functions available
      expect(actionDispatched.any).to.be.a('function');

      actionDispatched.then(({ value, action }) => {
        expect(value).to.eql(promiseValue);
        expect(action).to.eql(fulfilledAction);
        done();
      });
    });

    context('When resolve reason is null:', () => {
      const nullResolveAction = {
        type: defaultPromiseAction.type,
        payload: Promise.resolve(null)
      };

      it('resolved action.type dispatched', done => {
        const actionDispatched = store.dispatch(nullResolveAction);

        actionDispatched.then(({ value, action }) => {
          expect(action).to.eql({
            type: `${nullResolveAction.type}_FULFILLED`
          });
          done();
        });
      });

      it('returns null value', done => {
        const actionDispatched = store.dispatch(nullResolveAction);

        actionDispatched.then(({ value, action }) => {
          expect(value).to.be.null;
          done();
        });
      });

      it('action.payload is undefined', done => {
        const actionDispatched = store.dispatch(nullResolveAction);

        actionDispatched.then(({ value, action }) => {
          expect(action.payload).to.be.undefined;
          done();
        });
      });
    });

    it('persists meta from original action', async () => {
      await store.dispatch({
        type: promiseAction.type,
        payload: promiseAction.payload,
        meta: metaData
      });

      expect(lastMiddlewareModfies.spy).to.have.been.calledWith({
        type: `${promiseAction.type}_FULFILLED`,
        payload: promiseValue,
        meta: metaData
      });
    });

    it('returns value and action as parameters to `then()`', done => {
      const actionDispatched = store.dispatch({
        type: defaultPromiseAction.type,
        payload: Promise.resolve(promiseValue)
      });

      actionDispatched.then(({ value, action }) => {
        expect(value).to.eql(promiseValue);
        expect(action).to.eql(fulfilledAction);
        done();
      });
    });

    it('allows global customisation of fulfilled action.type', done => {
      store = makeStore({
        promiseTypeSuffixes: ['', customPrefix, '']
      });

      fulfilledAction = {
        type: `${promiseAction.type}_${customPrefix}`,
        payload: promiseValue
      };

      const actionDispatched = store.dispatch(promiseAction);

      actionDispatched.then(({ value, action }) => {
        expect(action).to.eql(fulfilledAction);
        expect(value).to.eql(promiseValue);
        done();
      });
    });
  });

  context('When promise is rejected:', () => {
    beforeEach(() => {
      promiseAction = {
        type: defaultPromiseAction.type,
        payload: Promise.reject(promiseReason)
      };

      rejectedAction = defaultRejectedAction;
    });

    // It is understood this is an antipattern, but nonetheless,
    // we would like to ensure the middleware still functions.
    context('When reject reason is null:', () => {
      const nullRejectAction = {
        type: defaultPromiseAction.type,
        payload: Promise.reject(null)
      };

      it('rejected action.type is dispatched', done => {
        const actionDispatched = store.dispatch(nullRejectAction);

        actionDispatched.catch(({ action, reason }) => {
          expect(action).to.eql({
            type: `${nullRejectAction.type}_REJECTED`,
            error: true
          });
          done();
        });
      });

      it('returns null reason', done => {
        const actionDispatched = store.dispatch(nullRejectAction);

        actionDispatched.catch(({ reason, action }) => {
          expect(reason).to.be.null;
          done();
        });
      });

      it('action.payload is undefined', done => {
        const actionDispatched = store.dispatch(nullRejectAction);

        actionDispatched.catch(({ reason, action }) => {
          expect(action.payload).to.be.undefined;
          done();
        });
      });
    });

    it('argument is instance of error', done => {
      const actionDispatched = store.dispatch({
        type: promiseAction.type,
        payload: promiseAction.payload,
        meta: metaData
      });

      actionDispatched.catch(error => {
        expect(error).to.be.instanceOf(Error);
        done();
      });
    });

    it('persists meta from original action', done => {
      const actionDispatched = store.dispatch({
        type: promiseAction.type,
        payload: promiseAction.payload,
        meta: metaData
      });

      actionDispatched.catch(({ reason, action }) => {
        expect(action.meta).to.eql(metaData);
        done();
      });
    });

    it('returns reason and action as parameters to `then()`', done => {
      const actionDispatched = store.dispatch(promiseAction);

      actionDispatched.then(() => null, ({ reason, action }) => {
        expect(action).to.eql(rejectedAction);
        expect(reason).to.eql(promiseReason);
        done();
      });
    });

    it('allows errors to be handled with `catch()`', done => {
      promiseAction = {
        type: promiseAction.type,
        payload: new Promise(() => {
          throw promiseReason;
        })
      };

      rejectedAction = {
        type: defaultRejectedAction.type,
        error: defaultRejectedAction.error,
        payload: promiseReason
      };

      const actionDispatched = store.dispatch(promiseAction);

      actionDispatched.catch(({ reason, action }) => {
        expect(action).to.eql(rejectedAction);
        expect(reason).to.eql(promiseReason);
        done();
      });
    });

    it('allows global customisation of rejected action.type', done => {
      store = makeStore({
        promiseTypeSuffixes: ['', '', customPrefix]
      });

      rejectedAction = {
        type: `${promiseAction.type}_${customPrefix}`,
        error: rejectedAction.error,
        payload: promiseReason
      };

      const actionDispatched = store.dispatch(promiseAction);

      actionDispatched.catch(({ reason, action }) => {
        expect(action).to.eql(rejectedAction);
        expect(reason).to.eql(promiseReason);
        done();
      });
    });

    it('throws original rejected error instance', done => {
      const baseError = new Error('Base Error');

      const actionDispatched = store.dispatch({
        type: defaultPromiseAction.type,
        payload: Promise.reject(baseError)
      });

      actionDispatched.catch(error => {
        const { reason, action } = error;

        expect(reason).to.be.equal(baseError);
        expect(action.payload).to.be.equal(baseError);

        done();
      }).catch(done);
    });
  });
});
