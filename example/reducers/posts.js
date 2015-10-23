import * as types from '../constants/post';
import defaultState from './defaultState';

/*
 * @function post
 * @description This reducer holds the state of a post after it is fetched
 * from the server.
 * @param {object} state The previous state
 * @param {object} action The dispatched action
 * @returns {object} state The updated state
 */
export default function posts(state = defaultState, action) {
  switch (action.type) {
    case `${types.GET_POSTS}_PENDING`:
      return {
        ...defaultState,
        isPending: true
      };

    case `${types.GET_POSTS}_FULFILLED`:
      return {
        ...defaultState,
        isFulfilled: true,
        error: false,
        data: action.payload
      };

    case `${types.GET_POSTS}_REJECTED`:
      return {
        ...defaultState,
        isRejected: true,
        error: action.payload
      };

    default: return state;
  }
}
