# Use with Redux Promise Middleware Actions

To use this middleware with [redux-promise-middleware-actions](https://github.com/omichelsen/redux-promise-middleware-actions), invoke `createAsyncAction` and return a promise from the payload creator.

```js
import { createAsyncAction } from 'redux-promise-middleware-actions';

// Create an async action
const fooAction = createAsyncAction('FOO', async (url) => {
  const response = await fetch(url);
  return response.json();
});

// Use async action
dispatch(fooAction('https://some.url'));
```

This would dispatch `FOO_PENDING` and `FOO_FULFILLED` with the data as the payload. `fooAction` has a reference to these action creators on the object itself, e.g. `fooAction.pending()`. You can listen for these in the reducer like this:

```js
const reducer = (state, action) => {
  switch (action.type) {
    case String(fooAction.pending):
      return {
        ...state,
        pending: true,
      };
    case String(fooAction.fulfilled):
      return {
        ...state,
        data: action.payload,
        error: undefined,
        pending: false,
      };
    case String(fooAction.rejected):
      return {
        ...state,
        error: action.payload,
        pending: false,
      };
    default:
      return state;
  }
};
```
