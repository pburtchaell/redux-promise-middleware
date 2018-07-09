import createStore from './utils/createStore';

it('action dispatched for given synchronous function', () => {
  const store = createStore();

  const dispatched = {
    type: 'ACTION',
    payload() {
      return 'foo';
    }
  };

  const expected = {
    type: 'ACTION',
    payload: 'foo',
  };

  store.dispatch(dispatched);

  expect(store.lastSpy.mock.calls[0]).toEqual([expected]);
});
