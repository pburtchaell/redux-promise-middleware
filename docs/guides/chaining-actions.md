# Chaining actions

When a promise is resolved, one might want to dispatch additional actions in response respond. One example could be changing the route after a user is successfully signed in. Another could be showing an error message after a request fails.

First, note this behavior uses thunks, so you will need to include [Redux Thunk](https://github.com/gaearon/redux-thunk) in your middleware stack.

```js
const foo () => {
  return dispatch => {

    return dispatch({
      type: 'TYPE',
      payload: new Promise()
    }).then(() => dispatch(bar()));
  };
}
```

If you need to chain several actions, using `Promise.all` is suggested.

```js
const foo () => {
  return dispatch => {

    return dispatch({
      type: 'TYPE',
      payload: Promise.all([
        dispatch(bar()),
        dispatch(baz())
      ])
    });
  };
}
```
