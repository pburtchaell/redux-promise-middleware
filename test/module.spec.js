import promise, { createPromise, ActionType } from 'redux-promise-middleware';

test('module exports default `import promise from \'redux-promise-middleware\'', () => {
  expect(promise.length).toBe(0);
});

test('module exports `import { createPromise } from \'redux-promise-middleware\'', () => {
  const middleware = createPromise();
  expect(middleware.length).toBe(1);
});

test('module exports `import { ActionType } from \'redux-promise-middleware\'', () => {
  expect(typeof ActionType).toBe('object');
  expect(ActionType.Pending).toBe('PENDING');
  expect(ActionType.Fulfilled).toBe('FULFILLED');
  expect(ActionType.Rejected).toBe('REJECTED');
});
