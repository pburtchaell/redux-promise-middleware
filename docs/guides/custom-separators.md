# Type Separators Configuration

In the case you need to use different type separators, you can configure this globally for all actions.

To do so, you can supply an optional configuration object to the middleware. This object accepts a string that can be used instead of the default separator with a key of `promiseTypeSeparator`.

```js
applyMiddleware(
  promiseMiddleware({
    promiseTypeSeparator: '/'
  })
)
```
