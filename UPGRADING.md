# 2.0.0 to 3.0.0

This release introduces some major changes to the functionality of the middleware:

**First, the middleware returns a promise instead of the action.**

``` js
// before
const foo = () => ({
  type: 'FOO',
  payload: {
    promise: Promise.resolve('foo')
  }
});

foo().action.promise.then(value => {
  console.log(value); // => 'foo'
});

// after
const bar = () => ({
  type: 'BAR',
  payload: Promise.resolve('bar')
});

bar().then(({ value }) => {
  console.log(value); // => 'bar'
});
```

**Second, a new promise is created** so `.then()` and `.catch()` work as expected.

``` js
// before
const foo = () => ({
  type: 'FOO',
  payload: {
    promise: Promise.reject('foo')
  }
});

foo().action.promise.then(
  value => {
    console.log(value); // => 'foo'
  },
  reason => {
    // nothing happens
  }
);

// after
const bar = () => ({
  type: 'BAR',
  payload: Promise.reject('bar')
});

bar().then(
  ({ value }) => {
    // ...
  },
  ({ reason }) => {
    console.log(reason); // => 'bar'
  }
);

const baz = () => ({
  type: 'BAZ',
  payload: new Promise((resolve, reject) => {
    throw 'baz'
  })
});

bar().catch(({ reason }) => {
  console.log(reason) // => 'baz'
});
```

**Third, promises can be explicitly or implicitly in the action object.**

```js
// before
const foo = () => ({
  type: 'FOO',
  payload: {
    promise: Promise.resolve()
  }
});

// after, with implicit promise as the value of the 'payload' property
const bar = () => ({
  type: 'BAR',
  payload: Promise.resolve()
});
```

Of course, if you prefer the explicit syntax, this still works. This syntax is also required for optimistic updates.

```js
// after, but with explicit 'promise' property and 'data' property
const bar = () => ({
  type: 'BAZ',
  payload: {
    promise: Promise.resolve(),
    data: ...
  }
});
```

**Fourth, thunks are no longer bound to the promise.** If you are chaining actions with Redux Thunk, this is critical change.

```js
// before, with Redux Thunk
const foo = () => ({
  type: 'FOO',
  payload: {
    promise: new Promise((resolve, reject) => {
      ...
    }).then(
      value => (action, dispatch) => {
        // handle fulfilled
        dispatch(someSuccessHandlerActionCreator());
      },
      reason => (action, dispatch) => {
        // handle rejected
        dispatch(someErrorHandlerActionCreator());
      }
    )
  }
});

// after, with Redux Thunk
const bar = () => {
  return (dispatch, getState) => {


    return dispatch({
      type: 'FOO',
      payload: Promise.resolve('foo')
    }).then(
      ({ value, action }) => {
        console.log(value); // => 'foo'
        console.log(action.type); // => 'FOO_FULFILLED'
        dispatch(someSuccessHandlerActionCreator());
      },
      ({ reason, action }) => {
        // handle rejected
        dispatch(someErrorHandlerActionCreator());
      }
    );
  };
};
```

If you have questions, please feel free to create an issue on GitHub. All changes are [further documented](https://github.com/pburtchaell/redux-promise-middleware/tree/master/docs).
