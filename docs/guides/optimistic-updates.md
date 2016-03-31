# Optimistic updates

You may pass an optional `data` object. This is dispatched from the pending action and is useful for optimistic updates.

```js
const foo = data => ({
  type: 'FOO',
  payload: {
    promise: new Promise(),
    data: data
  }
});
```

Considering the action creator above, the pending action would be described as:

```js
// pending action
{
  type: 'FOO_PENDING',
  payload: {
    data: ...
  }
}
```
