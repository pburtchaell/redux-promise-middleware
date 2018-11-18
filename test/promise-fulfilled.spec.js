import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

test('pending action dispatched with given payload', (done) => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.WILL_RESOLVE)();
  const expected = getActionCreator(types.FULFILLED)();

  return dispatch(dispatched).then(({ value, action: actionFromPromise }) => {
    expect(value).toEqual(expected.payload);
    expect(actionFromPromise.payload).toEqual(expected.payload);
    expect(lastSpy.mock.calls[1]).toEqual([expected]);
    done();
  });
});

test('pending action dispatched with given meta', (done) => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.META_FIELD)();
  const expected = getActionCreator(types.FULFILLED_META_FIELD)();

  return dispatch(dispatched).then(({ value, action: actionFromPromise }) => {
    expect(value).toEqual(expected.payload);
    expect(actionFromPromise.meta).toEqual(expected.meta);
    expect(lastSpy.mock.calls[1]).toEqual([expected]);
    done();
  });
});

test('fulfilled action dispatched with custom type', (done) => {
  const { dispatch, lastSpy } = createStore({
    promiseTypeSuffixes: [undefined, 'SUCCESS', undefined]
  });

  const dispatched = getActionCreator(types.WILL_RESOLVE)();
  const expected = {
    ...getActionCreator(types.FULFILLED)(),
    type: 'ACTION_SUCCESS',
  };

  return dispatch(dispatched).then(() => {
    expect(lastSpy.mock.calls[1]).toEqual([expected]);
    done();
  });
});
