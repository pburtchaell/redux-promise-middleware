# Reducers

Handling actions dispatched by Redux Promise Middleware is simple by default.

```js
const FOO_TYPE = 'FOO';

// action creator
const fooActionCreator = () => ({
  type: FOO_TYPE
  payload: Promise.resolve('foo')
});


// reducer
const fooReducer = (state = {}, action) => {
  case `${FOO_TYPE}_PENDING`:
    return {};

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
```

In a large application with many async actions, having many reducers with this same structure can grow redundant. In order to keep reducers in large applications DRY, you may benefit from trying alternative reducer solutions. One such solution could be [type-to-reducer](https://github.com/tomatau/type-to-reducer).

```js
import typeToReducer from 'type-to-reducer';

const BAR_TYPE = 'FOO';

// action creator
const barActionCreator = () => ({
  type: BAR_TYPE
  payload: Promise.resolve('bar')
});

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
