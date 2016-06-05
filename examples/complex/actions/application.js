import * as types from '../constants/application';
import checkBrowser from '../utils/checkBrowser';
import checkServer from '../utils/checkServer';

// check if the browser is supported
const performSupportCheck = () => ({
  type: types.APPLICATION_SUPPORT_CHECK,
  payload: checkBrowser()
})

// check if the API is available
const performServerCheck = () => ({
  type: types.APPLICATION_SERVER_CHECK,
  payload: checkServer(),
  meta: { request: true }
})

// initialize the application
export function initialize() {
  return dispatch => {

    return dispatch({
      type: types.APPLICATION_INITIALIZE_CHECK,
      payload: Promise.all([
        dispatch(performSupportCheck()),
        dispatch({
          type: 'APPLICATION_CHECK_DELAY',
          payload: new Promise(resolve => setTimeout(resolve, 2000))
        }),
        dispatch(performServerCheck())
      ])
    })
  };
}
