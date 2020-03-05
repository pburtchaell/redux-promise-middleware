import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

describe('given a promise resolved with a null value', () => {
  test('resolved action dispatched with ~undefined~ payload', (done) => {
    const { dispatch, firstSpy, lastSpy } = store;

    const dispatched = getActionCreator(types.NULL_PROMISE)();
    const expected = getActionCreator(types.FULFILLED_NULL_PROMISE)();

    const action = dispatch(dispatched);

    expect(firstSpy.mock.calls[0]).toEqual([dispatched]);

    action.then(() => {
      expect(lastSpy.mock.calls[1]).toEqual([expected]);
      done();
    });
  });

  test('promise returns null value', (done) => {
    const { dispatch } = store;

    const dispatched = getActionCreator(types.NULL_PROMISE)();

    const action = dispatch(dispatched);

    action.then(({ value, action: actionFromPromise }) => {
      expect(value).toEqual(null);
      expect(actionFromPromise.payload).toEqual(null);
      done();
    });
  });
});
