import { combineReducers } from 'redux';

export default combineReducers({
  application: require('./application').default
});
