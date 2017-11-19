import * as types from '../constants/application';
import Network from '../utils/network';

// Check if the REST API is available
const performServerCheck = () => ({
  type: types.APPLICATION_SERVER_CHECK,
  payload: Network().get()
});

// Initialize the application
export function initialize() {
  return dispatch => dispatch({
    type: types.APPLICATION_INITIALIZE_CHECK,
    payload: Promise.all([
      dispatch(performServerCheck()),

      // Add a mock two second delay
      new Promise(resolve => setTimeout(resolve, 2000))
    ])
  });
}

export default initialize;
