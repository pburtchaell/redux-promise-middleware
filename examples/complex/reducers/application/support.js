import * as types from '../../constants/application';

const defaultState = {
  isInitialized: false
};

export default function support(state = defaultState, action) {
  switch (action.type) {
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
    case `${types.APPLICATION_INITIALIZE_CHECK}_PENDING`: return state;

    default: return state;
  }
}
