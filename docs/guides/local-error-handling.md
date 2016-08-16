# Local Error Handling

```js
// Example with thunk middleware
export function foo() {
  return dispatch => dispatch({
    type: 'FOO_ACTION',
    payload: Promise.reject()
  }).catch(error => {
    // handle error
  });
}
```
