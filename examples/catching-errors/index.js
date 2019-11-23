import React, { Component } from 'react';
import { render } from 'react-dom';
import * as actions from './actions';
import store from './store';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPending: false,
      error: null,
    };

    this.throwError = this.throwError.bind(this);
  }

  throwError() {
    const action = store.dispatch(actions.foo());

    this.setState({ isPending: true });

    action.catch(error => {
      this.setState({
        isPending: false,
        error: error.message,
      });
    });
  }

  render() {
    const { isPending, error } = this.state;

    return (
      <>
        <header>
          <h1>Catching Errors</h1>
          <p>This example demonstrates how to catch a rejected promise.</p>
        </header>
        <main>
          <button onClick={this.throwError} disabled={isPending}>
            Throw Error
          </button>
          <br />
          <div>
            Error caught: {`${typeof error === 'string'}`}
          </div>
          <div>
            Error Message: {`${error}`}
          </div>
        </main>
      </>
    );
  }
}

render(<App />, document.querySelector('#mount'));
