# Use with Redux Actions

To use this middleware with Redux Actions, return a promise from the payload creator. Note this example is experimental and not tested; it may not work as expected.

```js
// Create an async action
const fooAction = createAction('FOO', async () => {
  const { response } = await asyncFoo();
  return response;
});

// Use async action
fooAction('123')
```

This would dispatch `FOO_PENDING` and `FOO_FULFILLED` with the data as the payload.
