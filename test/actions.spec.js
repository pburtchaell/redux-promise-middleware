import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

test('dispatches sync actions with no mutations', () => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.DEFAULT)();
  const expected = getActionCreator(types.DEFAULT)();

  dispatch(dispatched);

  expect(lastSpy.mock.calls[0]).toEqual([expected]);
  expect(lastSpy.mock.calls.length).toEqual(1);
});
