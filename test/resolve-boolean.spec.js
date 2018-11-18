import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

describe('given a promise resolved with a boolean value', () => {
  test('resolved action dispatched with boolean payload', (done) => {
    const { dispatch, firstSpy, lastSpy } = store;

    const dispatched = getActionCreator(types.BOOLEAN_PROMISE)();
    const expected = getActionCreator(types.FULFILLED_BOOLEAN_PROMISE)();

    const action = dispatch(dispatched);

    expect(firstSpy.mock.calls[0]).toEqual([dispatched]);

    action.then(() => {
      expect(lastSpy.mock.calls[1]).toEqual([expected]);
      done();
    });
  });

  test('promise returns boolean value', (done) => {
    const { dispatch } = store;

    const dispatched = getActionCreator(types.BOOLEAN_PROMISE)();
    const expected = getActionCreator(types.FULFILLED_BOOLEAN_PROMISE)();

    const action = dispatch(dispatched);

    action.then(({ value, action: actionFromPromise }) => {
      expect(value).toEqual(expected.payload);
      expect(actionFromPromise.payload).toEqual(expected.payload);
      done();
    });
  });
});
