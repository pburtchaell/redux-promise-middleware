# Catching Errors Thrown by Rejected Promises

## The Principle

Redux promise middleware dispatches an action for a rejected promise, but does not catch the error thrown. **This is an expected behavior.** Because the error is not caught, you will (in most cases) get an "uncaught" warning in the developer console. Again, this is an expected behavior.

By principle, it's your application's responsibility to catch the error thrown by the rejected promise. It's not the responsibility of the middleware.

## How to Catch Promises

However, you probably want to catch the error. Here's some suggested approaches/solutions to this.

1. Catch/handle the error "globally" in error handling middleware
2. Catch/handle the error "locally" at the action creator

## Catching Errors Locally

Generally, it'll make sense to use local error handling to directly control the "side effect(s)" of an error.

This can be done by dispatching some specific action. Here's an example of handling an error locally at the action creator.

```js
export function foo() {
  return dispatch => ({
    type: 'FOO_ACTION',

    // Throw an error
    payload: new Promise(() => {
      throw new Error('foo');
    })

  // Catch the error locally
  }).catch(error => {
    console.log(error.message); // 'foo'

    // Dispatch a second action in response to the error
    dispatch(bar());
  });
}
```

Please note this example requires [Redux Thunk](https://github.com/gaearon/redux-thunk).

## Catching Errors Globally

In some cases, it might make sense to "globally" catch all errors or all errors of a certain action type. To give an example, you might want to show a alert modal whenever an error is thrown.

[There is an example of how this middleware would work](https://github.com/pburtchaell/redux-promise-middleware/tree/master/examples/catching-errors-with-middleware/middleware.js). Note that any middleware you write will see all rejected promises before they're passed up to action creators for handling.

## The unhandledrejection Event

A third option is to handle all rejected promises (not just promises used with Redux promise middleware) using an [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/Events/unhandledrejection) event. I wouldn't reccommend this because it assumes too much and could be difficult to debug, but there might be a case where it is useful for your program.
