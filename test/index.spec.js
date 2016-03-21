import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
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
    this.spy = sinon.spy((action) =>
      typeof action === 'function'
        ? action(ref.dispatch, ref.getState)
        : next(action)
    );
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

  afterEach(()=> {
    firstMiddlewareThunk.spy.reset();
    lastMiddlewareModfies.spy.reset();
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
      store = makeStore({ promiseTypeSuffixes: [ customPrefix, '', '' ] });
      store.dispatch(promiseAction);

      pendingAction.type = `${promiseAction.type}_${customPrefix}`;

      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    /**
     * The middleware should allow custom action type suffix(es) per dispatch
     * if the suffix is included in the meta of the action.
     */
    it('allows local customisation of action.type suffixes', () => {
      const actionMeta = { promiseTypeSuffixes: [ customPrefix, '', '' ] };

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
    beforeEach(()=> {
      promiseAction = {
        type: defaultPromiseAction.type,
        payload: Promise.resolve(promiseValue)
      };

      fulfilledAction = defaultFulfilledAction;
    });

    context('When resolve reason is null:', () => {
      const nullResolveAction = {
        type: defaultPromiseAction.type,
        payload: Promise.resolve(null)
      };

      it('resolved action.type dispatched', async () => {
        const action = store.dispatch(nullResolveAction);

        await action.then(({ value, action }) => {
          expect(action).to.eql({
            type: `${nullResolveAction.type}_FULFILLED`
          });
        });
      });

      it('returns null value', async () => {
        const action = store.dispatch(nullResolveAction);

        await action.then(({ value, action }) => {
          expect(value).to.be.null;
        });
      });

      it('action.payload is undefined', async () => {
        const action = store.dispatch(nullResolveAction);

        await action.then(({ value, action }) => {
          expect(action.payload).to.be.undefined;
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

    it('returns value and action as parameters to `then()`', async () => {
      const action = store.dispatch({
        type: defaultPromiseAction.type,
        payload: Promise.resolve(promiseValue)
      });

      await action.then(({ value, action }) => {
        expect(value).to.eql(promiseValue);
        expect(action).to.eql(fulfilledAction);
      });
    });

    it('allows global customisation of fulfilled action.type', async () => {
      store = makeStore({
        promiseTypeSuffixes: ['', customPrefix,'']
      });

      fulfilledAction = {
        type: `${promiseAction.type}_${customPrefix}`,
        payload: promiseValue
      };

      const action = store.dispatch(promiseAction);

      await action.then(({ value, action }) => {
        expect(action).to.eql(fulfilledAction);
        expect(value).to.eql(promiseValue);
      });
    });
  });

  context('When promise is rejected:', () => {
    beforeEach(()=> {
      promiseAction = {
        type: defaultPromiseAction.type,
        payload: Promise.reject(promiseReason)
      };

      rejectedAction = defaultRejectedAction;
    });

    context('When reject reason is null:', () => {
      const nullRejectAction = {
        type: defaultPromiseAction.type,
        payload: Promise.reject(null)
      };

      it('rejected action.type is dispatched', async () => {
        const action = store.dispatch(nullRejectAction);

        await action.catch(({ reason, action }) => {
          expect(action).to.eql({
            type: `${nullRejectAction.type}_REJECTED`,
            error: true
          });
        });
      });

      it('returns null reason', async () => {
        const action = store.dispatch(nullRejectAction);

        await action.catch(({ reason, action }) => {
          expect(reason).to.be.null;
        });
      });

      it('action.payload is undefined', async () => {
        const action = store.dispatch(nullRejectAction);

        await action.catch(({ reason, action }) => {
          expect(action.payload).to.be.undefined;
        });
      });
    });

    it('persists meta from original action', async () => {
      const action = store.dispatch({
        type: promiseAction.type,
        payload: promiseAction.payload,
        meta: metaData
      });

      await action.catch(({ reason, action }) => {
        expect(action.meta).to.eql(metaData);
      });
    });

    it('returns reason and action as parameters to `then()`', async () => {
      const action = store.dispatch(promiseAction);

      await action.then(() => null, ({ reason, action }) => {
        expect(action).to.eql(rejectedAction);
        expect(reason).to.eql(promiseReason);
      });
    });

    it('allows errors to be handled with `catch()`', async () => {
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

      const action = store.dispatch(promiseAction);

      await action.catch(({reason, action}) => {
        expect(action).to.eql(rejectedAction);
        expect(reason).to.eql(promiseReason);
      });
    });

    it('allows global customisation of rejected action.type', async () => {
      store = makeStore({
        promiseTypeSuffixes: ['', '', customPrefix]
      });

      rejectedAction = {
        type: `${promiseAction.type}_${customPrefix}`,
        error: rejectedAction.error,
        payload: promiseReason
      };

      const action = store.dispatch(promiseAction);

      await action.catch(({ reason, action }) => {
        expect(action).to.eql(rejectedAction);
        expect(reason).to.eql(promiseReason);
      });
    });
  });
});
