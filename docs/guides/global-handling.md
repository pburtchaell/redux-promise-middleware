# Handling actions globally

One may want to dispatch actions or notify users in the user-interface layer of an application when an error occurs or when a network request is made. In most cases, it makes sense to implement this functionality globally. For example, when _any_ error occurs, show a message. When _any_ network request occurs, show a spinner.

Or consider another use case from issue #69:

> We would like to always dispatch a logout action when ever we get a 401 back from our API. Likewise, I would like to have a global error action dispatched for every 500> response we get back.

There are two suggested solutions. Depending on your unique case, you may find one solution more effective than the other.

## Solution 1: Middleware

In order to globally handle all pending and rejected actions dispatched by promise middleware, you can create a new middleware. This middleware would evaulate actions dispatched by the promise middleware.

Considering the case explained above, if a rejected action describes a `401` or `500` error, the middleware can dispatch an action in response, e.g., log out the user or show an error message.

```js
// consider this rejected action dispatched by promise middleware
{
  type: 'FOO_REJECTED',
  body: {
    status: 401
    title: 'Unauthorized'
  },
  error: true
}

// example middleware
function middleware() {
  return next => action => {

    // regex to evaulate type strings
    const isPending = /.*\_PENDING(.*?)$/;
    const isFulfilled = /.*\_FULFILLED(.*?)$/;

    if (action.error === true) {
      if (action.body.status === '401') {
        next({
          // ...dispatch some action to handle the 401 error
        });

        /**
         * This return statement is important.
         * If you return nothing, the rejected action dispatched by
         * the promise middleware will not "reach" the reducers. You may
         * want this functionality. If you _do_ want the original
         * rejected action to reach the reducers, make sure to return it.
         */
        return; // no action returned

        // OR return the rejected action...
        // return action;
      }

      return action;
    }

    if (action.type.match(isPending)) {
      // handle pending actions
    }

    if (action.type.match(isFulfilled)) {
      // handle fulfilled actions
    }

    return next(action);
  }
}
```

This middleware *must follow* the promise middleware to work.

## Solution 2: Reducers

The previous example dispatches new actions. *This solution evaulates actions in reducers using regex.*

```js
function foo(state = {}, action) {
  const isPending = /.*\_PENDING(.*?)$/;

  if (action.type.match(isPending)) {
    return {
      // ... return change in state
    };
  }

  return state;
}
```
