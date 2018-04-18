# Redux Promise Middleware

[![npm version](https://img.shields.io/npm/v/redux-promise-middleware.svg?style=flat)](https://www.npmjs.com/package/redux-promise-middleware) [![Build Status](https://travis-ci.org/pburtchaell/redux-promise-middleware.svg?branch=master)](https://travis-ci.org/pburtchaell/redux-promise-middleware) [![npm downloads](https://img.shields.io/npm/dm/redux-promise-middleware.svg?style=flat)](https://www.npmjs.com/package/redux-promise-middleware)

Redux promise middleware enables robust handling of async action creators in [Redux](http://redux.js.org): it accepts a promise and dispatches pending, fulfilled and rejected actions.

```js
const promiseAction = () => ({
  type: 'PROMISE',
  payload: Promise.resolve(),
})
```

The middleware can also be combined with [Redux Thunk](https://github.com/gaearon/redux-thunk) to chain action creators.

```js
const secondAction = (data) => ({
  type: 'TWO',
  payload: data,
})

const first = () => {
  return (dispatch) => {
    const response = dispatch({
      type: 'ONE',
      payload: Promise.resolve(),
    })

    response.then((data) => {
      dispatch(secondAction(data))
    })
  }
}
```

## Documentation and Help

- [Introduction](/docs/introduction.md)
- [Guides](/docs/guides/)
- [Examples](/examples)

## Issues and Pull Requests

- [Contributing Guide](/.github/CONTRIBUTING.md)
- [Code of Conduct](/.github/CODE_OF_CONDUCT.md)

## Releases

- [Releases](https://github.com/pburtchaell/redux-promise-middleware/releases)
- [Version Upgrade Guide](/docs/upgrading.md)

**Older versions:**

- [4.x](https://github.com/pburtchaell/redux-promise-middleware/tree/4.4.0)
- [3.x](https://github.com/pburtchaell/redux-promise-middleware/tree/3.3.0)
- [2.x](https://github.com/pburtchaell/redux-promise-middleware/tree/2.4.0)
- [1.x](https://github.com/pburtchaell/redux-promise-middleware/tree/1.0.0)

## Maintainers

- Patrick Burtchaell (pburtchaell):
  - [Twitter](https://twitter.com/pburtchaell)
  - [GitHub](https://github.com/pburtchaell)
- Thomas Hudspith-Tatham (tomatau):
  - [GitHub](https://github.com/tomatau)

Please reach out to us if you have any questions!

---
Copyright (c) 2015-Current Patrick Burtchaell. [Code licensed with the MIT License (MIT)](/LICENSE). [Documentation licensed with the CC BY-NC License](https://creativecommons.org/licenses/by-nc/4.0/).
