# Redux Promise Middleware

[![npm version](https://img.shields.io/npm/v/redux-promise-middleware.svg?style=flat)](https://www.npmjs.com/package/redux-promise-middleware) [![Build Status](https://travis-ci.org/pburtchaell/redux-promise-middleware.svg)](https://travis-ci.org/pburtchaell/redux-promise-middleware) [![npm downloads](https://img.shields.io/npm/dm/localeval.svg?style=flat)](https://www.npmjs.com/package/redux-promise-middleware)

# Getting Started

Install with npm: `npm i redux-promise-middleware -S`

## Usage

First, import the middleware and include it in `applyMiddleware` when creating the Redux store:

```js
import promiseMiddleware from 'redux-promise-middleware';

composeStoreWithMiddleware = applyMiddleware(
  promiseMiddleware()
)(createStore);

```

To use the middleware, dispatch a promise within the `payload` of the action and specify a `type` string. You may pass an optional `data` object. This is dispatched from the pending action and is useful for optimistic updates.

The pending action is dispatched immediately with the original type string and a suffix of `_PENDING`. The fulfilled action is dispatched only if the promise is resolved, e.g., if it was successful; and the rejected action is dispatched only if the promise is rejected, e.g., if an error occurred. The fulfilled and rejected suffixes are `_FULFILLED` and `_REJECTED` respectively.

```js
export function myAsyncActionCreator(data) {
  return {
    type: 'ACTION',
    payload: {
      promise: doSomethingAsyncAndReturnPromise(data),
      data: data
    }
  };
}
```

The middleware returns a [FSA compliant](https://github.com/acdlite/flux-standard-action) action for both rejected and resolved/fulfilled promises. In the case of a rejected promise, an `error` is returned.

## Type Suffix Configuration

When adding the middleware to your middleware composition layer, you can supply an optional options object. This object accepts an array of suffix strings that can be used instead of the default `['PENDING', 'FULFILLED', 'REJECTED']` with a key of `promiseTypeSuffixes`.

```js
applyMiddleware(
  promiseMiddleware({
    promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR']
  })
)
```

Alternatively, you can supply the same options at the action level inside the meta options that will change these suffixes on a per action type basis.

```js
export function myAsyncActionCreator(data) {
  return {
    type: 'ACTION',
    payload: {
      promise: doSomethingAsyncAndReturnPromise(data),
      data: data
    },
    meta: {
      promiseTypeSuffixes: ['WAIT', 'YAY', '!@£$']
    }
  };
}
```

---
Licensed MIT. Copyright 2015 Patrick Burtchaell.
