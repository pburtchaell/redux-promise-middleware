# Async/Await

Instead of chaining your async code with `.then().then().then()`, you can use async/await.

Consider this silly example. First, request `fooData`, then request `barData` and exit the function (also resolving the promise).

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

Please note there is no need to `return await` in an async function. [See this ESLint rule for more details](https://eslint.org/docs/rules/no-return-await).
