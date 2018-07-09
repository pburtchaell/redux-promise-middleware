import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

test('Enables async functions as the payload field', async () => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.ASYNC_FUNCTION_WILL_RESOLVE)();

  const action = dispatch(dispatched);

  // Expect actions are dispatched like usual
  return action.then(() => {
    expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING)()]);
    expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.FULFILLED)()]);
  });
});

test('Enables async function as the payload.promise field', () => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.ASYNC_FUNCTION_PROMISE_FIELD)();

  const action = dispatch(dispatched);

  // Expect actions are dispatched like usual
  return action.then(() => {
    expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING)()]);
    expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.FULFILLED)()]);
  });
});

test('Enables async functions and optimistic updates', async () => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.ASYNC_FUNCTION_OPTIMISTIC_UPDATE)();

  const action = dispatch(dispatched);

  // Expect actions are dispatched like usual
  return action.then(() => {
    expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING_OPTIMISTIC_UPDATE)()]);
    expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.FULFILLED)()]);
  });
});

test('Supports rejected async functions', async () => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.ASYNC_FUNCTION_WILL_REJECT)();

  const promiseSpy = jest.fn();
  const action = dispatch(dispatched);

  // Expect actions are dispatched like usual
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
