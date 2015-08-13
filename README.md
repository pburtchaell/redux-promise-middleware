# Redux Promise Middleware

[![npm version](https://img.shields.io/npm/v/redux-promise-middleware.svg?style=flat-square)](https://www.npmjs.com/package/redux-promise-middleware)

# Getting Started

Install with npm: `npm i redux-promise-middleware -S`

## Usage

First, import the middleware and include it when creating the Redux store:

```js
import promiseMiddleware from 'redux-promise-middleware';

export default createStore(reducers, {}, [
  promiseMiddleware,
]);
```

To use the middleware, dispatch a promise within the `payload` of the action and specify a `types` array. You may pass an optional `data` object. This is dispatched from the pending action and is useful for optimistic updates.

The pending action is dispatched immediately. The fulfilled action is dispatched only if the promise is resolved, e.g., if it was successful; and the rejected action is dispatched only if the promise is rejected, e.g., if an error occurred.

```js
export function myAsyncActionCreator(data) {
  return {
    types: [
      'ACTION_PENDING',
      'ACTION_FULFILLED',
      'ACTION_REJECTED'
    ],
    payload: {
      promise: doSomethingAyncAndReturnPromise(data),
      data: data
    }
  };
}
```

The middleware returns a [FSA compliant](https://github.com/acdlite/flux-standard-action) action for both rejected and resolved/fulfilled promises. In the case of a rejected promise, an `error` is returned.

---
Licensed MIT. Copyright 2015 Patrick Burtchaell.
