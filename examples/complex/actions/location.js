import * as types from '../constants/location';
import { history } from '../router';

/*
 * @function update
 * @description Update the location of React Router.
 * @param {string} path
 * @returns {function}
 */
export function update(path) {
  return dispatch => {
    history.pushState({}, path);

    return dispatch({
      type: types.LOCATION_UPDATE
    });
  }
}
