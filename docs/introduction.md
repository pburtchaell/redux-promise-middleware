# Introduction

## Installation

First, install the middleware with npm:

```
npm i redux-promise-middleware -s
```

Or with Yarn:

```
yarn add redux-promise-middleware
```

## Setup

Import the middleware and include it in `applyMiddleware` when creating the Redux store:

```js
import promiseMiddleware from 'redux-promise-middleware'

composeStoreWithMiddleware = applyMiddleware(
  promiseMiddleware(),
)(createStore)
```

## Use

Dispatch a promise as the value of the `payload` property of the action.

```js
const foo = () => ({
  type: 'FOO',
  payload: new Promise(),
})
```

A pending action is immediately dispatched.

```js
{
  type: 'FOO_PENDING'
}
```

Once the promise is settled, a second action will be dispatched. If the promise is resolved a fulfilled action is dispatched.

```js
{
  type: 'FOO_FULFILLED'
  payload: {
    ...
  }
}
```

On the other hand, if the promise is rejected, a rejected action is dispatched.

```js
{
  type: 'FOO_REJECTED'
  error: true,
  payload: {
    ...
  }
}
```

If you need to send extra information not included in the `payload` property, you can use the `meta` property.

```js
const foo = () => ({
  type: 'FOO',
  payload: new Promise(),
  meta: {
    ...
  },
})
```

That's it!

## TypeScript

`redux-promise-middleware` also supports TypeScript.

## Further Reading

- [Catching Errors Thrown by Rejected Promises](guides/rejected-promises.md)
- [Use with Reducers](guides/reducers.md)
- [Optimistic Updates](guides/optimistic-updates.md)
- [Design Principles](guides/design-principles.md)

---
Copyright (c) 2015-current Patrick Burtchaell. [Code licensed with the MIT License (MIT)](/LICENSE). [Documentation licensed with the CC BY-NC License](LICENSE).
