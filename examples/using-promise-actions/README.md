# Using Promise Middleware with redux-promise-middleware-actions

This example demonstrates how to use the promise middleware with [redux-promise-middleware-actions](https://www.npmjs.com/package/redux-promise-middleware-actions). This provides a shorthand for creating asynchronous actions with a single function definition.

Using the `createAsyncAction` action creator function you supply a function that returns a promise, and the middleware will take care of dispatching "pending", "fulfilled" and "rejected" actions:

```js
import { createAsyncAction } from 'redux-promise-middleware-actions';

export const getDog = createAsyncAction('GET_DOG', () => (
  fetch('https://dog.ceo/api/breeds/image/random')
    .then((response) => response.json())
));

dispatch(getDog()); // { type: 'GET_DOG_PENDING' }
```

The action creator function has the added benefit of strongly typed references to the action types so you don't have to maintain an enum list:

```js
getDog.pending.toString():   // 'GET_DOG_PENDING'
getDog.fulfilled.toString(): // 'GET_DOG_FULFILLED'
getDog.rejected.toString():  // 'GET_DOG_REJECTED'
```

In the example, the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) is used to request an image of a dog from a JSON API (called the [Dog API](https://dog.ceo/dog-api/), woof woof!). When the request is pending, a loading message is rendered. When the request is fulfilled, the image is rendered.

## Getting Started

- Clone this repository to your computer
- Open the folder for this example
- Run `npm i` to install dependencies
- Run `npm start` to start the example
- Open `http://localhost:1234` in a web browser
