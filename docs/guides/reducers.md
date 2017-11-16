# Use with Reducers

Handling actions dispatched by Redux promise middleware is simple by default.

```js
const FOO_TYPE = 'FOO';

// Dispatch the action
const fooActionCreator = () => ({
  type: FOO_TYPE
  payload: Promise.resolve('foo')
});

// Handle the action
const fooReducer = (state = {}, action) => {
  switch(action.type) {
    case `${FOO_TYPE}_PENDING`:
      return;

    case `${FOO_TYPE}_FULFILLED`:
      return {
        isFulfilled: true,
        data: action.payload
      };

    case `${FOO_TYPE}_REJECTED`:
      return {
        isRejected: true,
        error: action.payload
      };

    default: return state;
  }
}
```

### Promise Suffixes

Optionally, the default promise suffixes can be imported from this module. This can be useful in your reducers.

```js
import { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';
```

## Large Applications

In a large application with many async actions, having many reducers with this same structure can grow redundant.

To keep your reducers [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), you might see value in using a solution like [type-to-reducer](https://github.com/tomatau/type-to-reducer).

```js
import typeToReducer from 'type-to-reducer';

const BAR_TYPE = 'BAR';

// Dispatch the action
const barActionCreator = () => ({
  type: BAR_TYPE
  payload: Promise.resolve('bar')
});

// Handle the action
const barReducer = typeToReducer({
  [BAR_TYPE]: {
    PENDING: () => ({
      // ...
    }),
    REJECTED: (state, action) => ({
      isRejected: true,
      error: action.payload
    }),
    FULFILLED: (state, action) => ({
      isFulfilled: true,
      data: action.payload
    })
  }
}, {});
```
