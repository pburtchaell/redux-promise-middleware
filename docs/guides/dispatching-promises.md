# Dispatching Promises

## Implicitly

```js
const foo = () => ({
  type: 'FOO',
  payload: new Promise()
});
```

## Explicitly

```js
const foo = () => ({
  type: 'FOO',
  payload: {
    promise: new Promise()
  }
});
```
