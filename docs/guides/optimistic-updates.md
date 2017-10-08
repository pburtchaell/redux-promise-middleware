# Optimistic Updates

## What are optimistic updates?

> Optimistic [updates to a UI] don't wait for an operation to finish to update to the final state. They immediately switch to the final state, showing fake data for the time while the real operation is still in-progress.
> - Igor Mandrigin, UX Planet

["Optimistic UI,"](https://uxplanet.org/optimistic-1000-34d9eefe4c05#.twmtjnmaw) a short article by UX Planet, is a great summary if you are unfamiliar with the practice. In short, it's the practice of updating the UI when a request is pending. This makes the experience more fluid for users.

Because promise middleware dispatches a pending action, it is easy to optimistically update the Redux store.

## Code

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
  payload: data
}
```
