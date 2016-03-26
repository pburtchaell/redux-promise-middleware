import * as types from '../../constants/application';

const defaultState = {
  isSupported: false,
  isInitialized: false
}

export default function support(state = defaultState, action) {
  switch (action.type) {
    case `${types.APPLICATION_SUPPORT_CHECK}_FULFILLED`:
      return {
        ...state,
        isSupported: true
      };

    case `${types.APPLICATION_SUPPORT_CHECK}_REJECTED`:
      return {
        ...state,
        isSupported: false
      };

    case `${types.APPLICATION_INITIALIZE_CHECK}_FULFILLED`:
      return {
        ...state,
        isInitialized: true
      };

    case `${types.APPLICATION_INITIALIZE_CHECK}_REJECTED`:
      return {
        ...state,
        isInitialized: false
      };

    case `${types.APPLICATION_SUPPORT_CHECK}_PENDING`: return state;
    case `${types.APPLICATION_INITIALIZE_CHECK}_PENDING`: return state;

    default: return state;
  }
}
