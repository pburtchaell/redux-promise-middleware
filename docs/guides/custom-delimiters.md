# Type Delimiter Configuration

In the case you need to use different type delimiters, you can configure this globally for all actions. By default, the middleware uses a underscore `_` delimiter.

For example, given `FOO` async action, `PENDING` type will be appended with a underscore `_` delimiter.

```js
{
  type: 'FOO_PENDING'
}
```

To change the default, supply an optional configuration object to the middleware with the `promiseTypeDelimiter` property. This property accepts a new string to use as the delimiter.

```js
import { createPromise } from 'redux-promise-middleware';

applyMiddleware(
  createPromise({
    promiseTypeDelimiter: '/'
  })
)
```

With this configuration, given `FOO` async action, the type will be appended with a forward slash `/` delimiter.

```js
{
  type: 'FOO/PENDING'
}
```

Finally, if you are using a library like [type-to-reducer](https://github.com/tomatau/type-to-reducer), you'll also need to [configure it to handle the custom delimiter]](https://github.com/tomatau/type-to-reducer#custom-type-delimiter).
