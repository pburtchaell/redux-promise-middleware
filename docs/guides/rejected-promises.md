# Catching Rejected Promises

The middleware dispatches rejected actions, but does not actually catch the rejected promise. As a result, you may get a "uncaught" rejected promise warning in the console.

To present this from happening, one can (a) create a second middleware, following the promise middleware, that globally catches all errors/rejected promises; or (b) catch the rejected promise in the action creator, if you are using thunk middleware.

```js
// Example with thunk middleware
export function fooActionCreator() {
  return dispatch => dispatch({
    type: 'FOO_ACTION',
    payload: Promise.reject()
  }).catch(...);
}
```

The reason this middleware does not catch the rejected action is because it takes responsibility for dispatching actions only. *It is designed to avoid swallowing errors* by catching rejected promises.
