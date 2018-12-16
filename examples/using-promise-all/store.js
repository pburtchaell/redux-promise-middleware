import { createStore, applyMiddleware } from 'redux';
import promise from '../../src/index';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

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
