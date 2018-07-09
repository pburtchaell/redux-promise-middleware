import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

test('pending action contains given optimistic update of type object', () => {
  const { dispatch, firstSpy, lastSpy } = store;

  const dispatched = getActionCreator(types.OPTIMISTIC_UPDATE)();
  const expected = getActionCreator(types.PENDING_OPTIMISTIC_UPDATE)();

  dispatch(dispatched);

  expect(firstSpy.mock.calls[0]).toEqual([dispatched]);
  expect(lastSpy.mock.calls[0]).toEqual([expected]);
});

test('pending action contains given optimistic update of type boolean', () => {
  const { dispatch, firstSpy, lastSpy } = store;

  const dispatched = {
    ...getActionCreator(types.OPTIMISTIC_UPDATE)(),
    payload: {
      promise: Promise.resolve(),
      data: true,
    },
  };

  const expected = {
    ...getActionCreator(types.PENDING_OPTIMISTIC_UPDATE)(),
    payload: true,
  };

  dispatch(dispatched);

  expect(firstSpy.mock.calls[0]).toEqual([dispatched]);
  expect(lastSpy.mock.calls[0]).toEqual([expected]);
});
