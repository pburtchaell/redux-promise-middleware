# 3.x to 4.0.0

This release introduces changes to error handling.

Previously, the parameter of the rejected promise callback was both the dispatched action and an error object. The middleware also *always* constructed a new error object, which caused unexpected mutation and circular references.

**Now, the parameter of the rejected promise callback is the value of `reject`.** The middleware does not construct a new error; it is your responsibility to make sure the promise is rejected with an Error object.

```js
// before
const bar = () => ({
  type: 'FOO',
  payload: new Promise(() => {
    reject('foo');
  })
});.then(() => null, ({ reason, action }) => {
  console.log(action.type): // => 'FOO'
  console.log(reason.message); // => 'foo'
});

// after
const bar = () => ({
  type: 'FOO',
  payload: new Promise(() => {

    /**
     * Make sure the promise is rejected with an error. You
     * can also use `reject(new Error('foo'));`. It's a best
     * practice to reject a promise with an Error object.
     */
    throw new Error('foo');
  })
});.then(() => null, error => {
  console.log(error instanceof Error); // => true
  console.log(error.message); // => 'foo'
});
```

# 2.x to 3.0.0

This release introduces some major changes to the functionality of the middleware:

**First, the middleware returns a promise instead of the action.**

```js
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
