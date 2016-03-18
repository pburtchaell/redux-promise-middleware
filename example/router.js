import React from 'react';
import { Router, useRouterHistory } from 'react-router';
import { createHistory, useBasename } from 'history';
import { locationUpdate } from './actions/location';
import store from './store';

// Create a history object so it can be used by the location actions
const history = useRouterHistory(createHistory)();

const renderRouter = () => (
  <Router
    routes={require('./routes').default}
    history={history}
  />
);

export {
  history,
  renderRouter
};
