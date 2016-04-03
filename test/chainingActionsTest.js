import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from '../src/index';
import thunkMiddleware from 'redux-thunk';

describe('Chaining actions:', () => {
  it('should be "thenable" after dispatch', () => {
    const reducer = (state = 0) => state;
    const createStoreWithMiddleware = applyMiddleware(
        thunkMiddleware,
        promiseMiddleware
    )(createStore);
    const store = createStoreWithMiddleware(reducer);

    const action = () =>
      dispatch => {
        const result = dispatch({
          type: 'TYPE',
          payload: { promise: Promise.resolve('foo') }
        }).then(() => {
            // On resolve
        });
        return result;
      };
    store.dispatch(action());
  });
});
