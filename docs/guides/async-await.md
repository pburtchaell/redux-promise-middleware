# Use with Async/Await

Instead of chaining your async code with `.then().then().then()`, you can use async/await.

Consider this example. First, request `fooData`, then request `barData` and exit the function (also resolving the promise).

```js
{
  type: 'TYPE',
  async payload () {
    const fooData = await getFooData();
    const barData = await getBarData(fooData);

    return barData;
  }
}
```

Async/await can be combined with data for [optimistic updates](optimistic-updates.md):

```js
{
  type: 'OPTIMISTIC_TYPE',
  payload: {
    data: {
      ...
    },
    async promise () {
      ...
    }
  }
}
```

Please note there is no need to `return await` in an async function. [See this ESLint rule for more details](https://eslint.org/docs/rules/no-return-await).
