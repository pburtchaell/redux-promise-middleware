export const foo = () => ({
  type: 'FOO',
  // When you throw an error, always instantiate a new Error object with `new Error()`
  payload: Promise.reject(new Error('foo')),
});

export const bar = () => ({
  type: 'BAR',
  payload: Promise.reject(new Error('bar')),
});
