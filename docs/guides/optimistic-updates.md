# Optimistic updates

You may pass an optional `data` object. This is dispatched from the pending action and is useful for optimistic updates.

```js
const fooActionCreator = data => ({
  type: 'FOO',
  payload: {
    promise: new Promise(),
    data: data,
  }
});
```
