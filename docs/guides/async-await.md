# Async/Await

Instead of chaining your async code with `.then().then().then()`, you can write your `payload.promise` (or just `payload`) as an `async` function:

```js
{
  type: 'MY_ACTION',
  async payload () {
    const apiResult = await getDataFromApi();

    if (someCondition) {
      return transformApiResult(apiResult);
    }

    return apiResult;
  }
}
```

## Notes

- There is no need to `return await` in an async function, [see this eslint rule for more details](https://eslint.org/docs/rules/no-return-await).