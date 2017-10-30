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

## Thunk-like functionality

Now that the payload is a function, the middleware will call it and pass `dispatch` and `getState` as arguments, like [redux-thunk](https://github.com/gaearon/redux-thunk):

```js
{
  type: 'MY_ACTION',
  async payload (dispatch, getState) {
    const state = getState();
    const apiResult = await getDataFromApi();

    if (state.someCondition) {
      dispatch(anotherAction());
    }

    return apiResult;
  }
}
```

## Notes

- There is no need to `return await` in an async function, [see this eslint rule for more details](https://eslint.org/docs/rules/no-return-await).
- There's a slight difference between this and redux-thunk.
  ```js
  // redux-thunk
  // The actions will be dispatched in this order:
  // - MY_ACTION
  // - OTHER_ACTION1
  // - OTHER_ACTION2
  function myAction () {
    return dispatch => {
      dispatch({ type: 'MY_ACTION' });
      dispatch({ type: 'OTHER_ACTION1' });
      dispatch({ type: 'OTHER_ACTION2' });
    };
  }

  // redux-promise-middleware
  // The actions will be dispatched in this order:
  // - OTHER_ACTION1
  // - OTHER_ACTION2
  // - MY_ACTION
  function myAction () {
    return {
      type: 'MY_ACTION',
      payload (dispatch) {
        dispatch({ type: 'OTHER_ACTION1' });
        dispatch({ type: 'OTHER_ACTION2' });
      }
    };
  }
  ```