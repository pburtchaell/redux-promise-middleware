/* eslint no-unused-vars: 0, no-unused-expressions: 0, no-shadow: 0 */
import Bluebird from 'bluebird';
import { createStore, applyMiddleware } from 'redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware, { PENDING, FULFILLED, REJECTED } from '../src/index';

describe('Redux Promise Middleware:', () => {
  let store;
  let promiseAction;
  let pendingAction;
  let fulfilledAction;
  let rejectedAction;

  const promiseValue = 'foo';
  const promiseReason = new Error('bar');
  const customPrefix = 'CUSTOM';
  const optimisticUpdateData = { foo: true };
  const metaData = { bar: true };
  const lastMiddlewareData = { baz: true };

  const defaultPromiseAction = {
    type: 'ACTION',
    payload: new Promise(resolve => resolve(promiseValue))
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

  it('must export correct default promise status', () => {
    chai.assert.equal(PENDING, 'PENDING');
    chai.assert.equal(FULFILLED, 'FULFILLED');
    chai.assert.equal(REJECTED, 'REJECTED');
  });

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
  function lastMiddlewareModifies(next) {
    this.spy = sinon.spy((action) => {
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
    () => next => lastMiddlewareModifies.call(lastMiddlewareModifies, next)
  )(createStore)(() => null);

  beforeEach(() => {
    store = makeStore();
  });

  afterEach(() => {
    firstMiddlewareThunk.spy.reset();
    lastMiddlewareModifies.spy.reset();
  });

  context('When action is not a promise:', () => {
    const mockAction = { type: 'ACTION' };

    it('invokes next with the action', () => {
      store.dispatch(mockAction);
      expect(lastMiddlewareModifies.spy).to.have.been.calledWith(mockAction);
    });

    it('returns the return from next middleware', () => {
      expect(store.dispatch(mockAction)).to.eql({
        ...mockAction,
        ...lastMiddlewareData
      });
    });

    it('does not dispatch any other actions', () => {
      const mockStore = configureStore([promiseMiddleware()]);
      const store = mockStore({});
      store.dispatch(mockAction);

      expect([mockAction]).to.eql(store.getActions());
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

    /**
     * This tests if the middleware dispatches a pending action when the payload
     * property has a Promise object as the value. This is considered an "implicit"
     * promise payload.
     */
    it('dispatches a pending action for implicit promise payload', () => {
      store.dispatch(promiseAction);
      expect(lastMiddlewareModifies.spy).to.have.been.calledWith(pendingAction);
    });

    /**
     * This tests if the middleware dispatches a pending action
     * when the payload has a `promise` property with a Promise object
     * as the value. This is considered an "explicit" promise payload because
     * the `promise` property explicitly describes the value.
     */
    it('dispatches a pending action for explicit promise payload', () => {
      store.dispatch({
        type: promiseAction.type,
        payload: {
          promise: promiseAction.payload
        }
      });
      expect(lastMiddlewareModifies.spy).to.have.been.calledWith(pendingAction);
    });


    /**
     * If the promise action is dispatched with a data property, that property and value
     * must be included in the pending action the middleware dispatches. This property
     * is used for optimistic updates.
     */
    it('pending action optionally contains optimistic update payload from data property', () => {
      store.dispatch({
        type: promiseAction.type,
        payload: {
          promise: promiseAction.payload,
          data: optimisticUpdateData
        }
      });
      expect(lastMiddlewareModifies.spy).to.have.been.calledWith({
        ...pendingAction,
        payload: optimisticUpdateData
      });
    });

    it('pending action optionally contains falsy optimistic update payload', () => {
      store.dispatch({
        type: promiseAction.type,
        payload: {
          promise: promiseAction.payload,
          data: 0
        }
      });
      expect(lastMiddlewareModifies.spy).to.have.been.calledWith({
        ...pendingAction,
        payload: 0
      });
    });

    /**
     * If the promise action is dispatched with a meta property, the meta property
     * and value must be included in the pending action.
     */
    it('pending action does contain meta property if included', () => {
      store.dispatch(Object.assign({}, promiseAction, {
        meta: metaData
      }));
      expect(lastMiddlewareModifies.spy).to.have.been.calledWith(
        Object.assign({}, pendingAction, {
          meta: metaData
        })
      );
    });

    it('pending action does contain falsy meta property if included', () => {
      store.dispatch(Object.assign({}, promiseAction, {
        meta: 0
      }));
      expect(lastMiddlewareModifies.spy).to.have.been.calledWith(
        Object.assign({}, pendingAction, {
          meta: 0
        })
      );
    });

    /**
     * The middleware should allow global custom action types included
     * in the config when the middleware is constructed.
     */
    it('allows global customisation of action type suffixes', () => {
      store = makeStore({ promiseTypeSuffixes: [customPrefix, '', ''] });
      store.dispatch(promiseAction);

      expect(lastMiddlewareModifies.spy).to.have.been.calledWith(
        Object.assign({}, pendingAction, {
          type: `${promiseAction.type}_${customPrefix}`
        })
      );
    });

    /**
     * The middleware should allow global custom action type delimiter included
     * in the config when the middleware is constructed.
     */
    it('allows global customisation of action type delimiter', done => {
      store = makeStore({
        promiseTypeDelimiter: '/'
      });

      fulfilledAction = {
        type: `${promiseAction.type}/FULFILLED`,
        payload: promiseValue
      };

      const actionDispatched = store.dispatch(promiseAction);

      actionDispatched.then(({ value, action }) => {
        expect(action).to.eql(fulfilledAction);
        expect(value).to.eql(promiseValue);
        done();
      });
    });

    /**
     * The middleware should be backward compatible and use '_' as separator by default.
     */
    it('uses default separator with empty config (backward compatibility)', done => {
      store = makeStore({});

      fulfilledAction = {
        type: `${promiseAction.type}_FULFILLED`,
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

  context('When promise is fulfilled:', () => {
    beforeEach(() => {
      promiseAction = {
        type: defaultPromiseAction.type,
        payload: new Promise(resolve => resolve(promiseValue))
      };

      fulfilledAction = defaultFulfilledAction;
    });

    /**
     * This test ensures the original promise object is not mutated. In the case
     * a promise library is used, adding methods to the promise class, the
     * middleware should not remove those methods.
     */
    it('propagates the original promise', done => {
      const actionDispatched = store.dispatch({
        type: defaultPromiseAction.type,
        payload: Bluebird.resolve(promiseValue)
      });

      // Expect the promise returned has orginal methods available
      expect(actionDispatched.any).to.be.a('function');

      actionDispatched.then(
        ({ value, action }) => {
          expect(value).to.eql(promiseValue);
          expect(action).to.eql(fulfilledAction);
          done();
        },
        () => {
          expect(true).to.equal(false); // Expect this is not called
        }
      );
    });

    context('When resolve reason is null:', () => {
      const nullResolveAction = {
        type: defaultPromiseAction.type,
        payload: Promise.resolve(null)
      };

      it('resolved action is dispatched', done => {
        const actionDispatched = store.dispatch(nullResolveAction);

        actionDispatched.then(
          ({ value, action }) => {
            expect(action).to.eql({
              type: `${nullResolveAction.type}_FULFILLED`
            });
            done();
          },
          () => {
            expect(true).to.equal(false); // Expect this is not called
          }
        );
      });

      it('promise returns `null` value', done => {
        const actionDispatched = store.dispatch(nullResolveAction);

        actionDispatched.then(
          ({ value, action }) => {
            expect(value).to.be.null;
            done();
          },
          () => {
            expect(true).to.equal(false); // Expect this is not called
          }
        );
      });

      /**
       * If the resolved promise value is null, then there should not be a
       * payload on the dispatched resolved action.
       */
      it('resolved action `payload` property is undefined', done => {
        const actionDispatched = store.dispatch(nullResolveAction);

        actionDispatched.then(
          ({ value, action }) => {
            expect(action.payload).to.be.undefined;
            done();
          },
          () => {
            expect(true).to.equal(false); // Expect this is not called
          }
        );
      });
    });

    context('When resolve reason is false:', () => {
      const falseResolveAction = {
        type: defaultPromiseAction.type,
        payload: Promise.resolve(false)
      };

      it('resolved action is dispatched', done => {
        const actionDispatched = store.dispatch(falseResolveAction);

        actionDispatched.then(
          ({ value, action }) => {
            expect(action).to.eql({
              type: `${falseResolveAction.type}_FULFILLED`,
              payload: false
            });
            done();
          },
          () => {
            expect(true).to.equal(false); // Expect this is not called
          }
        );
      });

      it('promise returns `false` value', done => {
        const actionDispatched = store.dispatch(falseResolveAction);

        actionDispatched.then(
          ({ value, action }) => {
            expect(value).to.be.false;
            done();
          },
          () => {
            expect(true).to.equal(false); // Expect this is not called
          }
        );
      });

      /**
       * If the resolved promise value is false, then there should still be a
       * payload on the dispatched resolved action.
       */
      it('resolved action `payload` property is false', done => {
        const actionDispatched = store.dispatch(falseResolveAction);

        actionDispatched.then(
          ({ value, action }) => {
            expect(action.payload).to.be.false;
            done();
          },
          () => {
            expect(true).to.equal(false); // Expect this is not called
          }
        );
      });
    });

    context('When resolve reason is zero:', () => {
      const zeroResolveAction = {
        type: defaultPromiseAction.type,
        payload: Promise.resolve(0)
      };

      it('resolved action is dispatched', done => {
        const actionDispatched = store.dispatch(zeroResolveAction);

        actionDispatched.then(
          ({ value, action }) => {
            expect(action).to.eql({
              type: `${zeroResolveAction.type}_FULFILLED`,
              payload: 0
            });
            done();
          },
          () => {
            expect(true).to.equal(false); // Expect this is not called
          }
        );
      });

      it('promise returns `0` value', done => {
        const actionDispatched = store.dispatch(zeroResolveAction);

        actionDispatched.then(
          ({ value, action }) => {
            expect(value).to.eq(0);
            done();
          },
          () => {
            expect(true).to.equal(false); // Expect this is not called
          }
        );
      });

      /**
       * If the resolved promise value is zero, then there should still be a
       * payload on the dispatched resolved action.
       */
      it('resolved action `payload` property is zero', done => {
        const actionDispatched = store.dispatch(zeroResolveAction);

        actionDispatched.then(
          ({ value, action }) => {
            expect(action.payload).to.eq(0);
            done();
          },
          () => {
            expect(true).to.equal(false); // Expect this is not called
          }
        );
      });
    });

    it('persists `meta` property from original action', async () => {
      await store.dispatch({
        type: promiseAction.type,
        payload: promiseAction.payload,
        meta: metaData
      });

      expect(lastMiddlewareModifies.spy).to.have.been.calledWith({
        type: `${promiseAction.type}_FULFILLED`,
        payload: promiseValue,
        meta: metaData
      });
    });

    it('promise returns `value` and `action` as parameters', done => {
      const actionDispatched = store.dispatch({
        type: defaultPromiseAction.type,
        payload: Promise.resolve(promiseValue)
      });

      actionDispatched.then(
        ({ value, action }) => {
          expect(value).to.eql(promiseValue);
          expect(action).to.eql(fulfilledAction);
          done();
        },
        () => {
          expect(true).to.equal(false); // Expect this is not called
        }
      );
    });

    it('allows global customisation of fulfilled action `type`', done => {
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

  context('When using async functions:', () => {
    it('supports async function as payload.promise', async () => {
      const resolvedValue = 'FOO_DATA';

      const { value, action } = await store.dispatch({
        type: 'FOO',
        payload: {
          async promise() {
            return resolvedValue;
          }
        }
      });

      const callArgs = lastMiddlewareModifies.spy.getCalls().map(x => x.args[0]);

      expect(lastMiddlewareModifies.spy.callCount).to.eql(2);

      expect(callArgs[0]).to.eql({
        type: 'FOO_PENDING'
      });

      expect(callArgs[1]).to.eql({
        type: 'FOO_FULFILLED',
        payload: resolvedValue
      });
    });

    it('supports async function as payload', async () => {
      const resolvedValue = 'FOO_DATA';

      const { value, action } = await store.dispatch({
        type: 'FOO',
        async payload() {
          return resolvedValue;
        }
      });

      const callArgs = lastMiddlewareModifies.spy.getCalls().map(x => x.args[0]);

      expect(lastMiddlewareModifies.spy.callCount).to.eql(2);

      expect(callArgs[0]).to.eql({
        type: 'FOO_PENDING',
      });

      expect(callArgs[1]).to.eql({
        type: 'FOO_FULFILLED',
        payload: resolvedValue
      });
    });

    it('supports optimistic updates', async () => {
      const resolvedValue = 'FOO_DATA';
      const data = {
        foo: 1,
        bar: 1,
        baz: 3
      };

      const { value, action } = await store.dispatch({
        type: 'FOO',
        payload: {
          data,
          async promise() {
            return resolvedValue;
          }
        }
      });

      const callArgs = lastMiddlewareModifies.spy.getCalls().map(x => x.args[0]);

      expect(lastMiddlewareModifies.spy.callCount).to.eql(2);

      expect(callArgs[0]).to.eql({
        type: 'FOO_PENDING',
        payload: data
      });

      expect(callArgs[1]).to.eql({
        type: 'FOO_FULFILLED',
        payload: resolvedValue
      });
    });

    it('supports rejected async functions', async () => {
      const error = new Error(Math.random().toString());

      try {
        await store.dispatch({
          type: 'FOO',
          async payload() {
            throw error;
          }
        });

        throw new Error('Should not get here.');
      } catch (err) {
        const callArgs = lastMiddlewareModifies.spy.getCalls().map(x => x.args[0]);

        expect(lastMiddlewareModifies.spy.callCount).to.eql(2);

        expect(callArgs[0]).to.eql({
          type: 'FOO_PENDING',
        });

        expect(callArgs[1]).to.eql({
          type: 'FOO_REJECTED',
          error: true,
          payload: error
        });
      }
    });

    it('handles synchronous functions', () => {
      const resolvedValue = 'FOO_DATA';
      const metaValue = {
        foo: 'foo'
      };

      store.dispatch({
        type: 'FOO',
        meta: metaValue,
        payload() {
          return resolvedValue;
        }
      });

      const callArgs = lastMiddlewareModifies.spy.getCalls().map(x => x.args[0]);

      expect(lastMiddlewareModifies.spy.callCount).to.eql(1);
      expect(callArgs[0]).to.eql({
        type: 'FOO',
        meta: metaValue,
        payload: resolvedValue
      });
    });
  });

  context('When promise is rejected:', () => {
    beforeEach(() => {
      promiseAction = {
        type: defaultPromiseAction.type,
        payload: new Promise(() => {
          throw promiseReason;
        })
      };

      rejectedAction = defaultRejectedAction;
    });

    it('errors can be caught with `catch`', () => {
      const actionDispatched = store.dispatch(promiseAction);

      return actionDispatched
        .then(() => expect(true).to.equal(false))
        .catch(error => {
          expect(error).to.be.instanceOf(Error);
        });
    });

    it('errors can be caught with `then`', () => {
      const actionDispatched = store.dispatch(promiseAction);

      return actionDispatched.then(
        () => expect(true).to.equal(false),
        error => {
          expect(error).to.be.instanceOf(Error);
          expect(error.message).to.equal(promiseReason.message);
        }
      );
    });

    it('rejected action `error` property is true', () => {
      const mockStore = configureStore([
        promiseMiddleware(),
      ]);

      const store = mockStore({});

      return store.dispatch(promiseAction).catch(() => {
        const rejectedAction = store.getActions()[1];
        expect(rejectedAction.error).to.be.true;
      });
    });

    it('rejected action `payload` property is original rejected instance of Error', () => {
      const baseErrorMessage = 'error';
      const baseError = new Error(baseErrorMessage);

      const store = configureStore([
        promiseMiddleware(),
      ])({});

      return store.dispatch({
        type: defaultPromiseAction.type,
        payload: Promise.reject(baseError)
      }).catch(() => {
        const rejectedAction = store.getActions()[1];
        expect(rejectedAction.payload).to.be.equal(baseError);
        expect(rejectedAction.payload.message).to.be.equal(baseErrorMessage);
      });
    });

    it('promise returns original rejected instance of Error', () => {
      const baseErrorMessage = 'error';
      const baseError = new Error(baseErrorMessage);

      const actionDispatched = store.dispatch({
        type: defaultPromiseAction.type,
        payload: Promise.reject(baseError)
      });

      return actionDispatched.catch(error => {
        expect(error).to.be.equal(baseError);
        expect(error.message).to.be.equal(baseErrorMessage);
      });
    });

    it('allows global customisation of rejected action `type`', () => {
      const mockStore = configureStore([
        promiseMiddleware({
          promiseTypeSuffixes: ['', '', customPrefix]
        }),
      ]);

      const expectedRejectAction = {
        type: `${promiseAction.type}_${customPrefix}`,
        error: rejectedAction.error,
        payload: rejectedAction.payload,
      };

      const store = mockStore({});

      return store.dispatch(promiseAction).catch(() => {
        expect(store.getActions()).to.include(expectedRejectAction);
      });
    });
  });
});
