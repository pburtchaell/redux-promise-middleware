# Catching Rejected Promises

The middleware dispatches rejected actions but does not catch rejected promises. As a result, you may get an "uncaught" warning in the console. **This is expected behavior for an uncaught rejected promise.** It is your responsibility to catch the errors and not the responsibility of redux-promise-middleware.

To catch rejected promises, there are two common solutions:

1. Catch the rejected promise "globally" in your own middleware
2. Catch the rejected promise "locally" at the action creator

You will most likely employ both global and local error handling. It will make sense to use local error handling to directly control the "side-effect" of the error. This can be done by dispatching some specific action.

```js
// Example of handling an error locally at the action creator
// Note this requires thunk middleware to work
export function foo() {
  return dispatch => dispatch({
    type: 'FOO_ACTION',
    payload: new Promise(() => {
      throw new Error('foo');
    })
  }).catch(error => {
    // catch and handle error
  });
}
```

In other cases, it will make sense to globally handle all errors or errors of a certain type. For example, you may want to show errors in a modal. You can use a combination of custom middleware and actions to catch the error and show the modal. [There is an example of how this middleware would work](https://github.com/pburtchaell/redux-promise-middleware/blob/master/examples/complex/middleware/error.js). Note that any middleware you write will see all rejected promises before they're passed up to action creators for handling.

A third option is to handle _all_ rejected promises (not just Redux action promises) using an [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection) event—but this is outside of redux-promise-middleware's scope.
