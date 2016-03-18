import * as types from '../constants/session';
//import session from '../utils/server/session';
import * as location from './location';

/*
 * @function create
 * @description
 * @returns {function}
 * @fires Session#create
 * @fires location#update
 */
export function create(data) {
  return dispatch => {

    return dispatch({
      type: types.CREATE_SESSION,
      payload: {
        promise: session.create(data)
      }
    }).then(dispatch(location.update('/')));
  };
}
