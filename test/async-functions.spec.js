import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

test('actions dispatched for given async function - payload', async () => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.ASYNC_FUNCTION_WILL_RESOLVE)();

  const action = dispatch(dispatched);

  return action.then(() => {
    expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING)()]);
    expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.FULFILLED)()]);
  });
});

test('actions dispatched for given async function - payload.promise', () => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.ASYNC_FUNCTION_PROMISE_FIELD)();

  const action = dispatch(dispatched);

  return action.then(() => {
    expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING)()]);
    expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.FULFILLED)()]);
  });
});

test('pending action contains given optimistic update', async () => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.ASYNC_FUNCTION_OPTIMISTIC_UPDATE)();

  const action = dispatch(dispatched);

  return action.then(() => {
    expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING_OPTIMISTIC_UPDATE)()]);
    expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.FULFILLED)()]);
  });
});

test('rejected action dispatched for given rejected async function', async () => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.ASYNC_FUNCTION_WILL_REJECT)();

  const promiseSpy = jest.fn();
  const action = dispatch(dispatched);

  return action
    .then(promiseSpy)
    .catch(() => {
      expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING)()]);
      expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.REJECTED)()]);
    })
    .then(() => {
      expect(promiseSpy.mock.calls.length).toBe(0);
    });
});
