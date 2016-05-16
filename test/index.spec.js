import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { createStore, applyMiddleware } from 'redux';
import configureStore from 'redux-mock-store';
import promiseMiddleware from '../src';
chai.use(sinonChai);

describe('Promise Middleware:', () => {
  const nextHandler = promiseMiddleware();

  it('must return a function to handle next', () => {
    expect(nextHandler).to.be.a('function');
    expect(nextHandler.length).to.eql(1);
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
  // final middleware returns the action merged with dummy data
  const lastMiddlewareModfiesObject = { val: 'added-by-last-middleware' };
  function lastMiddlewareModfies(next) {
    this.spy = sinon.spy((action) => {
      next(action);
      return {
        ...action,
        ...lastMiddlewareModfiesObject
      };
    });
    return this.spy;
  }

  /*
    Function for creating a dumb store using fake middleware stack
   */
  const makeStore = (config) => applyMiddleware(
    (ref) => (next) => firstMiddlewareThunk.call(firstMiddlewareThunk, ref, next),
    promiseMiddleware(config),
    () => (next) => lastMiddlewareModfies.call(lastMiddlewareModfies, next)
  )(createStore)(()=>null);

  let store;
  beforeEach(()=> {
    store = makeStore();
  });

  afterEach(()=> {
    firstMiddlewareThunk.spy.reset();
    lastMiddlewareModfies.spy.reset();
  });

  context('When Action is Not a Promise:', () => {
    const mockAction = { type: 'NOT_PROMISE' };

    it('invokes next with the action', () => {
      store.dispatch(mockAction);
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(mockAction);
    });

    it('returns the return from next middleware', () => {
      expect(store.dispatch(mockAction)).to.eql({
        ...mockAction,
        ...lastMiddlewareModfiesObject
      });
    });

    it('does not dispatch any other actions', () => {
      const mockStore = configureStore([promiseMiddleware()]);
      store = mockStore({});
      store.dispatch(mockAction);
      expect(store.getActions()).to.eql([mockAction]);
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
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    it('optionally contains optimistic update payload from data property', () => {
      const optimisticUpdate = { fake: 'data' };
      // data from promise becomes payload of pending
      promiseAction.payload.data = optimisticUpdate;
      pendingAction.payload = optimisticUpdate;

      store.dispatch(promiseAction);
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    it('optionally contains meta property', () => {
      const meta = { fake: 'data' };
      promiseAction.meta = meta;
      pendingAction.meta = meta;
      store.dispatch(promiseAction);
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    it('allows customisation of global pending action.type', () => {
      const customPrefix = 'PENDIDDLE';
      store = makeStore({
        promiseTypeSuffixes: [customPrefix, '', '']
      });
      pendingAction.type = `${promiseAction.type}_${customPrefix}`;
      store.dispatch(promiseAction);
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    it('allows customisation of pending action.type per dispatch', () => {
      const customPrefix = 'PENDOODDLE';
      const actionMeta = { promiseTypeSuffixes: [customPrefix, '', ''] };
      promiseAction.meta = actionMeta;
      pendingAction.type = `${promiseAction.type}_${customPrefix}`;
      // FIXME: Test leak, should the promiseTypeSuffixes be in other actions?
      pendingAction.meta = actionMeta;
      store.dispatch(promiseAction);
      expect(lastMiddlewareModfies.spy).to.have.been.calledWith(pendingAction);
    });

    it('returns the new promise object', () => {
      expect(store.dispatch(promiseAction)).to.eql(promiseAction.payload.promise);
    });

    context('When Promise Rejects:', ()=> {
      let rejectingPromiseAction;
      let rejectedAction;
      let rejectValue;
      beforeEach(()=> {
        rejectValue = { test: 'rejected value' };
        rejectingPromiseAction = {
          type: 'HAS_REJECTING_PROMISE',
          payload: {
            promise: Promise.reject(rejectValue)
          }
        };
        rejectedAction = {
          type: `${rejectingPromiseAction.type}_REJECTED`,
          error: true,
          payload: rejectValue
        };
        pendingAction = {
          type: `${rejectingPromiseAction.type}_PENDING`
        };
      });

      it('dispatches both pending and rejected', () => {
        const mockStore = configureStore([promiseMiddleware()]);
        store = mockStore({});
        return store.dispatch(rejectingPromiseAction).catch(() => {
          expect(store.getActions()).to.eql([pendingAction, rejectedAction]);
        });
      });

      it('re-dispatches rejected action with error and payload from error', () => {
        return store.dispatch(rejectingPromiseAction).catch(() =>
          expect(lastMiddlewareModfies.spy).to.have.been.calledWith(rejectedAction)
        );
      });

      it('works when resolve is null', () => {
        rejectingPromiseAction.payload.promise = Promise.reject(null);
        rejectedAction = {
          type: `${rejectingPromiseAction.type}_REJECTED`,
          error: true
        };
        return store.dispatch(rejectingPromiseAction).catch(() =>
          expect(lastMiddlewareModfies.spy).to.have.been.calledWith(rejectedAction)
        );
      });

      it('persists meta from original action', () => {
        const metaData = { fake: 'data' };
        rejectingPromiseAction.meta = metaData;
        rejectedAction.meta = metaData;
        return store.dispatch(rejectingPromiseAction).catch(() =>
          expect(lastMiddlewareModfies.spy).to.have.been.calledWith(rejectedAction)
        );
      });

      it('allows promise to resolve thunk, pre-bound to rejected action', () => {
        const thunkResolve = (action, dispatch, getState) => {
          expect(action).to.eql({
            type: `${rejectingPromiseAction.type}_REJECTED`,
            error: true
          });
          expect(getState()).to.equal(store.getState());
          dispatch({ ...action, foo: 'bar' });
        };
        rejectingPromiseAction.payload.promise = Promise.reject(thunkResolve);
        return store.dispatch(rejectingPromiseAction).catch(() =>
          expect(lastMiddlewareModfies.spy).to.have.been.calledWith({
            type: `${rejectingPromiseAction.type}_REJECTED`,
            error: true,
            foo: 'bar'
          })
        );
      });

      it('allows customisation of global rejected action.type', () => {
        const customPrefix = 'REJIGGLED';
        store = makeStore({
          promiseTypeSuffixes: ['', '', customPrefix]
        });
        rejectedAction.type = `${rejectingPromiseAction.type}_${customPrefix}`;
        return store.dispatch(rejectingPromiseAction).catch(() =>
          expect(lastMiddlewareModfies.spy).to.have.been.calledWith(rejectedAction)
        );
      });

      it('allows customisation of rejected action.type per dispatch', () => {
        const customPrefix = 'REJOOGGLED';
        const actionMeta = { promiseTypeSuffixes: ['', '', customPrefix] };
        rejectingPromiseAction.meta = actionMeta;
        rejectedAction.type = `${rejectingPromiseAction.type}_${customPrefix}`;
        // FIXME: Test leak, should the promiseTypeSuffixes be in other actions?
        rejectedAction.meta = actionMeta;
        return store.dispatch(rejectingPromiseAction).catch(() =>
          expect(lastMiddlewareModfies.spy).to.have.been.calledWith(rejectedAction)
        );
      });
    });

    context('When Promise Fulfills', ()=> {
      let fulfillingPromiseAction;
      let fulfillingAction;
      let fulfilledValue;
      beforeEach(()=> {
        fulfilledValue = { test: 'fulfilled value' };
        fulfillingPromiseAction = {
          type: 'HAS_FULFILLING_PROMISE',
          payload: {
            promise: Promise.resolve(fulfilledValue)
          }
        };
        fulfillingAction = {
          type: `${fulfillingPromiseAction.type}_FULFILLED`,
          payload: fulfilledValue
        };
        pendingAction = {
          type: `${fulfillingPromiseAction.type}_PENDING`
        };
      });

      it('dispatches both pending and fulfilled', () => {
        const mockStore = configureStore([promiseMiddleware()]);
        store = mockStore({});
        store.dispatch(fulfillingPromiseAction).then(() => {
          expect(store.getActions()).to.eql([pendingAction, fulfillingAction]);
        });
      });

      it('re-dispatches fulfilled action with payload from promise', async () => {
        await store.dispatch(fulfillingPromiseAction);
        expect(lastMiddlewareModfies.spy).to.have.been.calledWith(fulfillingAction);
      });

      it('works when resolve is null', async () => {
        fulfillingPromiseAction.payload.promise = Promise.resolve(null);
        fulfillingAction = {
          type: `${fulfillingPromiseAction.type}_FULFILLED`
        };
        await store.dispatch(fulfillingPromiseAction);
        expect(lastMiddlewareModfies.spy).to.have.been.calledWith(fulfillingAction);
      });

      it('persists meta from original action', async () => {
        const metaData = { fake: 'data' };
        fulfillingPromiseAction.meta = metaData;
        fulfillingAction.meta = metaData;
        await store.dispatch(fulfillingPromiseAction);
        expect(lastMiddlewareModfies.spy).to.have.been.calledWith(fulfillingAction);
      });

      it('allows promise to resolve thunk, pre-bound to fulfilled action', async () => {
        const thunkResolve = (action, dispatch, getState) => {
          expect(action).to.eql({
            type: `${fulfillingPromiseAction.type}_FULFILLED`
          });
          expect(getState()).to.equal(store.getState());
          dispatch({ ...action, foo: 'bar' });
        };
        fulfillingPromiseAction.payload.promise = Promise.resolve(thunkResolve);
        await store.dispatch(fulfillingPromiseAction);
        expect(lastMiddlewareModfies.spy).to.have.been.calledWith({
          type: `${fulfillingPromiseAction.type}_FULFILLED`,
          foo: 'bar'
        });
      });

      it('allows customisation of global fulfilled action.type', async () => {
        const customPrefix = 'FULFIDDLED';
        store = makeStore({
          promiseTypeSuffixes: ['', customPrefix, '']
        });
        fulfillingAction.type = `${fulfillingPromiseAction.type}_${customPrefix}`;
        await store.dispatch(fulfillingPromiseAction);
        expect(lastMiddlewareModfies.spy).to.have.been.calledWith(fulfillingAction);
      });

      it('allows customisation of fulfilled action.type per dispatch', async () => {
        const customPrefix = 'FULFOODDLED';
        const actionMeta = { promiseTypeSuffixes: ['', customPrefix, ''] };
        fulfillingPromiseAction.meta = actionMeta;
        fulfillingAction.type = `${fulfillingPromiseAction.type}_${customPrefix}`;
        // FIXME: Test leak, should the promiseTypeSuffixes be in other actions?
        fulfillingAction.meta = actionMeta;
        await store.dispatch(fulfillingPromiseAction);
        expect(lastMiddlewareModfies.spy).to.have.been.calledWith(fulfillingAction);
      });

      it('should log errors made during dispatch within promise', async (done)=> {
        const testError = new Error('test error');
        sinon.stub(console, 'error');
        store = applyMiddleware(
          promiseMiddleware(),
        )(createStore)((state, action)=> {
          if (action.type === fulfillingAction.type) {
            throw testError;
          }
        });

        await store.dispatch(fulfillingPromiseAction);
        setTimeout(() => {
          expect(
            console.error // eslint-disable-line
          ).to.have.been.calledWith(testError);
          console.error.restore(); // eslint-disable-line
          done();
        }, 0);
      });
    });
  });
});
