import { types, getActionCreator, defaultError } from './utils/defaults';
import createStore from './utils/createStore';

let store;

beforeEach(() => { store = createStore(); });

test('Errors are caught with Promise#catch', () => {
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
    });
});

test('Errors are caught with Promise#then', () => {
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
    });
});

it('Rejected action includes `error` property with value of `true`', () => {
  const { dispatch, lastSpy } = store;

  const action = dispatch(getActionCreator(types.WILL_REJECT)());

  return action.catch(() => {
    expect(lastSpy.mock.calls[1][0].error).toBeTruthy();
  });
});

it('Promise returns original rejected instance of Error', () => {
  const { dispatch } = store;

  const dispatched = getActionCreator(types.WILL_REJECT)();

  return dispatch(dispatched).catch((error) => {
    expect(error).toEqual(defaultError);
    expect(error.message).toEqual(defaultError.message);
  });
});

it('allows global customisation of rejected action `type`', () => {
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
