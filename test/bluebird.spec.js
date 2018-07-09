import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

/*
 * This test ensures the original promise object is not mutated. In the case
 * a promise library is used, adding methods to the promise class, the
 * middleware should not remove those methods.
 */
test('original promise is propagated', () => {
  const { dispatch, lastSpy } = createStore();

  const dispatched = getActionCreator(types.BLUEBIRD)();

  const action = dispatch(dispatched);

  // Expect the promise returned has orginal methods available
  expect(action.any).toBeDefined();

  // Expect actions are dispatched like usual
  return action.catch(() => {
    expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING)()]);
    expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.FULFILLED)()]);
  });
});
