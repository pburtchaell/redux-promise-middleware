import * as types from '../constants/application';
import checkBrowser from '../utils/checkBrowser';
import checkServer from '../utils/checkServer';
import * as auth from './index';

/*
 * @function performSupportCheck
 * @description Check if the user's browser is supported.
 * @returns {object} FSA
 * @fires checkBrowserSupport
 */
function performSupportCheck() {
  return {
    type: types.APPLICATION_SUPPORT_CHECK,
    payload: checkBrowser(),
  };
}

/*
 * @function performServerCheck
 * @description Check if the Segment API is available.
 * @returns {object} FSA
 */
function performServerCheck() {
  return {
    type: types.APPLICATION_SERVER_CHECK,
    payload: checkServer(),
    meta: {
      request: true
    }
  };
}

/*
 * @function initialize
 * @description Initialize the application by checking support
 * authorization, if the Segment API (server) is alive and fetching
 * the user profile information.
 * @returns {function} thunk
 * @fires performSupportCheck
 * @fires performAuthorizationCheck
 */
export function initialize() {
  return dispatch => {

    return dispatch({
      type: types.APPLICATION_INITIALIZE_CHECK,
      payload: Promise.all([
        dispatch(performSupportCheck()),
        dispatch(performServerCheck())
      ])
    })
  };
}
