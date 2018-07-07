import React, { Fragment } from 'react';
import { render } from 'react-dom';
import * as actions from './actions';
import store from './store';

const App = () => (
  <Fragment>
    <header>
      <h1>Catching Errors with Middleware</h1>
      <p>This example demonstrates how to catch a rejected promise with an error middleware.</p>
      <p>Open the Developer Console to see logs for the dispatched actions.</p>
      <hr />
    </header>
    <main>
      <Fragment>
        <h2>Example 1: Foo</h2>
        <p>The &quot;foo&quot; action throws an error and the error is caught at the middleware.</p>
        <p>You&apos;ll see a normal error message in the console.</p>
        <button onClick={() => store.dispatch(actions.foo())}>
          Throw Foo
        </button>
      </Fragment>
      <Fragment>
        <h2>Example 2: Bar</h2>
        <p>The &quot;bar &quot; action throws an error and is uncaught.</p>
        <p>You&apos;ll see an &quot;Uncaught (in promise) Error&quot; message in the console.</p>
        <button onClick={() => store.dispatch(actions.bar())}>
          Throw Bar
        </button>
      </Fragment>
    </main>
  </Fragment>
);

render(<App />, document.querySelector('#mount'));
