import promise from 'redux-promise-middleware';

// For migration from version 5.x to version 6.0.0
test('module exports warns when incorrectly called', () => {
  // Replace the console.warn method with a mock/spy method
  global.console = { warn: jest.fn() };

  // Try to instantiate a middleware, which should call console.warn
  promise();

  // Make sure console.warn is called
  expect(console.warn).toHaveBeenCalled();
});
