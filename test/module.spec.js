import promiseMiddleware, { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

const middleware = promiseMiddleware();

test('Exports a function', () => {
  expect(middleware.length).toBe(1);
});

test('Exports promise types', () => {
  expect(PENDING).toBe('PENDING');
  expect(FULFILLED).toBe('FULFILLED');
  expect(REJECTED).toBe('REJECTED');
});
