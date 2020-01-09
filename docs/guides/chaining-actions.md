# Chaining Actions

When a promise is resolved, one might want to dispatch additional actions in response. One example could be changing the route after a user is successfully signed in. Another could be showing an error message after a request fails.

First, note this behavior uses thunks. You will need to include [Redux Thunk](https://github.com/gaearon/redux-thunk) in your middleware stack. 

*Note: Redux Thunk is a middleware that enables action creators to return a function instead of an object ([hence the name "thunk"](https://en.wikipedia.org/wiki/Thunk)). The returned function is called with a `dispatch` argument, which is what you can use to chain actions.*


```js
const foo = () => {
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
const foo = () => {
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

When handling a promise with `then`, the parameter is an object with two properties: (1) the "value" (if the promise is fulfilled) or the "reason" (if the promise is rejected) and (2) the object of the dispatched action.

```js
// fulfilled promise
const foo = () => {
  return dispatch => {

    return dispatch({
      type: 'FOO',
      payload: new Promise(resolve => {
        resolve('foo'); // resolve the promise with the value 'foo'
      })
    }).then(({ value, action }) => {
      console.log(value); // => 'foo'
      console.log(action.type); // => 'FOO_FULFILLED'
    });
  };
}

// rejected promise
const bar = () => {
  return dispatch => {

    return dispatch({
      type: 'BAR',
      payload: new Promise(() => {
        throw new Error('foo'); // reject the promise for the reason 'bar'
      })
    }).then(() => null, error => {
      console.log(error instanceof Error) // => true
      console.log(error.message); // => 'foo'
    });
  };
}
```

Rejected promises can also be handled with `.catch()`.

```js
// rejected promise with throw
const baz = () => {
  return dispatch => {

    return dispatch({
      type: 'BAZ',
      payload: new Promise(() => {
        throw new Error(); // throw an error
      })
    }).catch((error) => {
      console.log(error instanceof Error) // => true
    });
  };
}
```
