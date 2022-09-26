import { types, getActionCreator } from './utils/defaults';
import createStore from './utils/createStore';

let store;

// The middleware should use '_' as delimiter by default
test('actions dispatched with default delimiter', (done) => {
  store = createStore();

  const dispatched = getActionCreator(types.WILL_RESOLVE)();
  const expected = getActionCreator(types.FULFILLED)();

  store.dispatch(dispatched).then(({ value, action }) => {
    expect(value).toEqual(expected.payload);
    expect(action).toEqual(expected);
    done();
  });
});

// The middleware should allow global custom action type delimiter
test('actions dispatched with custom delimiter', (done) => {
  store = createStore({ promiseTypeDelimiter: '/' });

  const dispatched = getActionCreator(types.WILL_RESOLVE)();

  const expected = {
    ...getActionCreator(types.FULFILLED)(),
    type: `${dispatched.type}/FULFILLED`,
  };

  return store.dispatch(dispatched).then(({ value, action }) => {
    expect(value).toEqual(expected.payload);
    expect(action).toEqual(expected);
    done();
  });
});

// The middleware should allow empty string delimiter
test('actions dispatched with custom delimiter', (done) => {
  store = createStore({ promiseTypeDelimiter: '' });

  const dispatched = getActionCreator(types.WILL_RESOLVE)();

  const expected = {
    ...getActionCreator(types.FULFILLED)(),
    type: `${dispatched.type}FULFILLED`,
  };

  return store.dispatch(dispatched).then(({ value, action }) => {
    expect(value).toEqual(expected.payload);
    expect(action).toEqual(expected);
    done();
  });
});
