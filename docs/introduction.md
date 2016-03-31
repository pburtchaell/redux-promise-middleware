## Introduction

First, install with npm: `npm i redux-promise-middleware -S`

Second, import the middleware and include it in `applyMiddleware` when creating the Redux store:

```js
import promiseMiddleware from 'redux-promise-middleware';

composeStoreWithMiddleware = applyMiddleware(
  promiseMiddleware()
)(createStore);
```

To use the middleware, dispatch a promise as the value of the `payload` property of the action. You can also explicitly dispatch a promise as the value of `payload.promise`.

```js
// implicit promise
const foo = () => ({
  type: 'FOO',
  payload: new Promise()
});

// explicit promise
const foo = () => ({
  type: 'FOO',
  payload: {
    promise: new Promise()
  }
});
```

A "pending" action is dispatched immediately with the original type string and a suffix of `_PENDING`.

```js
// pending action
{
  type: 'FOO_PENDING'
}
```

After the promise is resolved, a second action will be dispatched. If the the promise is resolved, e.g., if it was successful, a "fulfilled" action is dispatched. If the promise is rejected, e.g., if an error occurred, the "rejected" action is dispatched. The fulfilled and rejected type suffixes are `_FULFILLED` and `_REJECTED` respectively.

```js
// fulfilled action
{
  type: 'FOO_FULFILLED'
  payload: {
    ...
  }
}

// rejected action
{
  type: 'FOO_REJECTED'
  error: true,
  payload: {
    ...
  }
}
```
