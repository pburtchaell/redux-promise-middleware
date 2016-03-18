import { combineReducers } from 'redux';

export default combineReducers({
  session: require('./session').default
});
