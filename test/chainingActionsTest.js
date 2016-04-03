import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from '../src/index';
import thunkMiddleware from 'redux-thunk';

describe('Chaining actions:', () => {
  it('should be "thenable" after dispatch', () => {
    const reducer = (state = 0) => state; // Dummy reducer
    const createStoreWithMiddleware = applyMiddleware(
        thunkMiddleware,
        promiseMiddleware
    )(createStore);
    const store = createStoreWithMiddleware(reducer);

    const action = () => // Thunk action creator
      dispatch =>
        dispatch({
          type: 'TYPE',
          payload: { promise: Promise.resolve('foo') } // Dummy promise
        }).then(() => {
            // On resolve
        });
    store.dispatch(action()); // Call action creator and dispatch
  });
});
