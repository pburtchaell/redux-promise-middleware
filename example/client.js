import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <Provider store={store()}>
          <h1>Hi</h1>
        </Provider>
      </div>
    );
  }
}

render(<App />, document.querySelector('#mount'));
