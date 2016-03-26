import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import store from './store';

// Create a history object so it can be used by the location actions
const history = useRouterHistory(createHistory)();

const renderRouter = () => (
  <Provider store={store}>
    <Router
      routes={require('./routes').default}
      history={history}
    />
  </Provider>
);

export {
  history,
  renderRouter
};
