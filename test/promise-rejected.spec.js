import { types, getActionCreator, defaultError } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

test('errors caught with Promise#catch method', (done) => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.WILL_REJECT)();

  const promiseSpy = jest.fn();
  const action = dispatch(dispatched);

  return action
    .then(promiseSpy)
    .catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING)()]);
      expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.REJECTED)()]);
    })
    .then(() => {
      expect(promiseSpy.mock.calls.length).toBe(0);
      done();
    });
});

test('errors caught with Promise#then method', (done) => {
  const { dispatch, lastSpy } = store;

  const dispatched = getActionCreator(types.WILL_REJECT)();

  const promiseSpy = jest.fn();
  const action = dispatch(dispatched);

  return action
    .then(promiseSpy, (error) => {
      expect(error).toBeInstanceOf(Error);
      expect(lastSpy.mock.calls[0]).toEqual([getActionCreator(types.PENDING)()]);
      expect(lastSpy.mock.calls[1]).toEqual([getActionCreator(types.REJECTED)()]);
    })
    .then(() => {
      expect(promiseSpy.mock.calls.length).toBe(0);
      done();
    });
});

test('rejected action dispatched with truthy error property', () => {
  const { dispatch, lastSpy } = store;

  const action = dispatch(getActionCreator(types.WILL_REJECT)());

  return action.catch(() => {
    expect(lastSpy.mock.calls[1][0].error).toBeTruthy();
  });
});

test('promise returns original Error instance', () => {
  const { dispatch } = store;

  const dispatched = getActionCreator(types.WILL_REJECT)();

  return dispatch(dispatched).catch((error) => {
    expect(error).toEqual(defaultError);
    expect(error.message).toEqual(defaultError.message);
  });
});

test('rejected action dispatched with custom type', () => {
  const { dispatch, lastSpy } = createStore({
    promiseTypeSuffixes: [undefined, undefined, 'ERROR']
  });

  const dispatched = getActionCreator(types.WILL_REJECT)();
  const expected = {
    ...getActionCreator(types.REJECTED)(),
    type: 'ACTION_ERROR',
  };

  return dispatch(dispatched).catch(() => {
    expect(lastSpy.mock.calls[1]).toEqual([expected]);
  });
});
