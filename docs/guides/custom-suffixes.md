# Type suffix configuration

In the case you need to use different type suffixes, you can configure this globally (all actions) or locally (action-by-action).

To globally change suffixes, you can supply an optional configuration object to the middleware. This object accepts an array of suffix strings that can be used instead of the default with a key of `promiseTypeSuffixes`.

```js
applyMiddleware(
  promiseMiddleware({
    promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'ERROR']
  })
)
```
