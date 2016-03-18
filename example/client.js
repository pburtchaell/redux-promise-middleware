import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { renderRouter } from './router';
import store from './store';
import './polyfills';

const App = () => (
  <div className="app-container">
    <Provider store={store}>
      {renderRouter()}
    </Provider>
  </div>
)

render(<App />, document.querySelector('#mount'));
