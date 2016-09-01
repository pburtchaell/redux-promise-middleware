# Using with Redux Actions

To use this middleware with Redux Actions, return a promise from the payload creator. Note this example is experimental and not tested for, so it may not work as expected.

```js
// create an async action
const fooAction = createAction('FOO', async () => {
  const { response } = await asyncFoo();
  return response;
});

// use async action
fooAction('123')
// should now dispatch `FOO_PENDING` and `FOO_FULFILLED` with the data as the payload
```
