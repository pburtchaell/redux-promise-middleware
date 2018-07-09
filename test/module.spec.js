import promiseMiddleware, { PENDING, FULFILLED, REJECTED } from 'redux-promise-middleware';

const middleware = promiseMiddleware();

test('module exports function', () => {
  expect(middleware.length).toBe(1);
});

test('module exports promise types', () => {
  expect(PENDING).toBe('PENDING');
  expect(FULFILLED).toBe('FULFILLED');
  expect(REJECTED).toBe('REJECTED');
});
