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

## Async/Await

For more on using async/await, [see the guide](async-await.md).

```js
const foo = () => ({
  type: 'FOO',
  async payload() {
    const data = await getDataFromApi():

    return data;
  }
});
```
