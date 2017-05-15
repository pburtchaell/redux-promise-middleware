import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from '../../../src/index';
import errorMiddleware from '../middleware/error';
import * as types from '../constants/error';
import * as actions from './error';

const DEFAULT_ERROR_MESSAGE = 'foo';

const mockStore = configureStore([
  thunkMiddleware,
  errorMiddleware,
  promiseMiddleware(),
]);

describe(`Example: ${actions.rejectPromiseWithGlobalError.name}`, () => {
  it('should create rejected promise that is handled "globally"', async () => {
    const store = mockStore({});
    const message = DEFAULT_ERROR_MESSAGE;
    const action = actions.rejectPromiseWithGlobalError;

    const expectedActions = [{
      type: `${types.GLOBAL_ERROR}_PENDING`
    }, {
      error: true,
      type: `${types.GLOBAL_ERROR}_REJECTED`,
      payload: new Error(message)
    }];

    return await store.dispatch(action(message)).then(() => {
      const actualActions = store.getActions();
      expect(actualActions).to.eql(expectedActions);
    });
  });
});

describe(`Example: ${actions.rejectPromiseWithLocalError.name}`, () => {
  it('should create rejected promise that is handled "locally"', async () => {
    const store = mockStore({});
    const message = DEFAULT_ERROR_MESSAGE;
    const action = actions.rejectPromiseWithLocalError;

    const expectedActions = [{
      type: `${types.LOCAL_ERROR}_PENDING`
    }, {
      error: true,
      type: `${types.LOCAL_ERROR}_REJECTED`,
      payload: new Error(message)
    }];

    return await store.dispatch(action(message)).catch(() => {
      const actualActions = store.getActions();
      expect(actualActions).to.eql(expectedActions);
    });
  });
});
