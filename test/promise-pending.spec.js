import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

/*
 * Test if the middleware dispatches a pending action when the payload
 * property has a Promise object as the value. This is considered an "implicit"
 * promise payload.
 */
test('pending action dispatched for promise - payload', () => {
  const { dispatch, firstSpy, lastSpy } = store;

  const dispatched = getActionCreator(types.WILL_RESOLVE)();
  const expected = getActionCreator(types.PENDING)();

  dispatch(dispatched);

  expect(firstSpy.mock.calls[0]).toEqual([dispatched]);
  expect(lastSpy.mock.calls[0]).toEqual([expected]);
});

/*
 * Tests if the middleware dispatches a pending action
 * when the payload has a `promise` property with a Promise object
 * as the value. This is considered an "explicit" promise payload because
 * the `promise` property explicitly describes the value.
 */
test('pending action dispatched for promise - payload.promise', () => {
  const { dispatch, firstSpy, lastSpy } = store;

  const dispatched = getActionCreator(types.PROMISE_FIELD)();
  const expected = getActionCreator(types.PENDING)();

  dispatch(dispatched);

  expect(firstSpy.mock.calls[0]).toEqual([dispatched]);
  expect(lastSpy.mock.calls[0]).toEqual([expected]);
});

test('pending action contains given meta of type object', () => {
  const { dispatch, firstSpy, lastSpy } = store;

  const meta = {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
  };

  const dispatched = {
    ...getActionCreator(types.WILL_RESOLVE)(),
    meta,
  };

  const expected = {
    ...getActionCreator(types.PENDING)(),
    meta,
  };

  dispatch(dispatched);

  expect(firstSpy.mock.calls[0]).toEqual([dispatched]);
  expect(lastSpy.mock.calls[0]).toEqual([expected]);
});

test('pending action contains given meta of type boolean', () => {
  const { dispatch, firstSpy, lastSpy } = store;

  const meta = true;

  const dispatched = {
    ...getActionCreator(types.WILL_RESOLVE)(),
    meta,
  };

  const expected = {
    ...getActionCreator(types.PENDING)(),
    meta,
  };

  dispatch(dispatched);

  expect(firstSpy.mock.calls[0]).toEqual([dispatched]);
  expect(lastSpy.mock.calls[0]).toEqual([expected]);
});
