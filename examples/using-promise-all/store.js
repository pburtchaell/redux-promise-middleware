import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promise from '../../src/index';

const defaultState = {
  images: [],
};

const reducer = (state = defaultState, action) => {
  if (action.payload && action.payload.image) {
    const { image } = action.payload;

    return {
      images: Array.isArray(state.images) ? [...state.images, image] : [image],
    };
  }

  return state;
};

const store = createStore(reducer, {}, applyMiddleware(
  thunk,
  promise,
  createLogger({ collapsed: true }),
));

export default store;
