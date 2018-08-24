import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { asyncReducer } from 'redux-promise-middleware-actions';
import promise from '../../src/index';
import { getDog } from './actions';

// Use the built-in reducer which will create a state
// for the response of `getDog()` with this shape:
//   {
//     data: <payload>,
//     pending: true | false,
//     error: <error>
//   }
const reducer = asyncReducer(getDog);

const store = createStore(reducer, {}, applyMiddleware(
  promise(),
  createLogger({ collapsed: true }),
));

export default store;
