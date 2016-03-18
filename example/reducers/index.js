import { combineReducers } from 'redux';

export default combineReducers({
  feed: require('./feed').default,
  post: require('./post').default,
  account: require('./account').default,
  application: require('./application').default
});
