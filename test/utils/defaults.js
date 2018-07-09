import Bluebird from 'bluebird';

// The action types tested for
export const types = {
  DEFAULT: 'DEFAULT',
  WILL_RESOLVE: 'WILL_RESOLVE',
  WILL_REJECT: 'WILL_REJECT',
  OPTIMISTIC_UPDATE: 'OPTIMISTIC_UPDATE',
  PROMISE_FIELD: 'PROMISE_FIELD',
  BLUEBIRD: 'BLUEBIRD',
  BOOLEAN_PROMISE: 'BOOLEAN_PROMISE',
  NULL_PROMISE: 'NULL_PROMISE',
  NUMBER_PROMISE: 'NUMBER_PROMISE',
  ASYNC_FUNCTION_WILL_RESOLVE: 'ASYNC_FUNCTION_WILL_RESOLVE',
  ASYNC_FUNCTION_WILL_REJECT: 'ASYNC_FUNCTION_WILL_REJECT',
  ASYNC_FUNCTION_PROMISE_FIELD: 'ASYNC_FUNC_PROMISE_FIELD',
  ASYNC_FUNCTION_OPTIMISTIC_UPDATE: 'ASYNC_FUNCTION_OPTIMISTIC_UPDATE',
  PENDING: 'PENDING',
  PENDING_OPTIMISTIC_UPDATE: 'PENDING_OPTIMISTIC_UPDATE',
  FULFILLED: 'FULFILLED',
  FULFILLED_BOOLEAN_PROMISE: 'FULFILLED_BOOLEAN_PROMISE',
  FULFILLED_NULL_PROMISE: 'FULFILLED_NULL_PROMISE',
  FULFILLED_NUMBER_PROMISE: 'FULFILLED_NUMBER_PROMISE',
  REJECTED: 'REJECTED',
};

export const defaultMetadata = { foo: 'foo' };
export const defaultPayload = 'foo';
export const defaultError = new Error('foo');

// A simple action with no payload
const defaultAction = {
  type: 'ACTION',
};

// The action creators supported by the test suite
const actions = {
  [types.DEFAULT]: () => (defaultAction),
  [types.WILL_RESOLVE]: () => ({
    type: defaultAction.type,
    payload: Promise.resolve(defaultPayload),
  }),
  [types.WILL_REJECT]: () => ({
    type: defaultAction.type,
    payload: new Promise((resolve, reject) => reject(defaultError)),
  }),
  [types.OPTIMISTIC_UPDATE]: () => ({
    type: defaultAction.type,
    payload: {
      promise: Promise.resolve(defaultPayload),
      data: defaultMetadata,
    },
  }),
  [types.PROMISE_FIELD]: () => ({
    type: defaultAction.type,
    payload: {
      promise: Promise.resolve(defaultPayload),
    },
  }),
  [types.BLUEBIRD]: () => ({
    type: defaultAction.type,
    payload: Bluebird.resolve(defaultPayload),
  }),
  [types.BOOLEAN_PROMISE]: () => ({
    type: defaultAction.type,
    payload: Promise.resolve(true),
  }),
  [types.NULL_PROMISE]: () => ({
    type: defaultAction.type,
    payload: Promise.resolve(null),
  }),
  [types.NUMBER_PROMISE]: () => ({
    type: defaultAction.type,
    payload: Promise.resolve(21),
  }),
  [types.ASYNC_FUNCTION_WILL_RESOLVE]: () => ({
    type: defaultAction.type,
    async payload() {
      return defaultPayload;
    },
  }),
  [types.ASYNC_FUNCTION_WILL_REJECT]: () => ({
    type: defaultAction.type,
    async payload() {
      throw new Error('foo');
    },
  }),
  [types.ASYNC_FUNCTION_PROMISE_FIELD]: () => ({
    type: defaultAction.type,
    payload: {
      async promise() {
        return Promise.resolve(defaultPayload);
      },
    },
  }),
  [types.ASYNC_FUNCTION_OPTIMISTIC_UPDATE]: () => ({
    type: defaultAction.type,
    payload: {
      async promise() {
        return Promise.resolve(defaultPayload);
      },
      data: defaultMetadata,
    },
  }),
  [types.PENDING]: () => ({
    type: `${defaultAction.type}_PENDING`,
  }),
  [types.PENDING_OPTIMISTIC_UPDATE]: () => ({
    type: `${defaultAction.type}_PENDING`,
    payload: defaultMetadata,
  }),
  [types.FULFILLED]: () => ({
    type: `${defaultAction.type}_FULFILLED`,
    payload: defaultPayload,
  }),
  [types.FULFILLED_BOOLEAN_PROMISE]: () => ({
    type: `${defaultAction.type}_FULFILLED`,
    payload: true,
  }),
  [types.FULFILLED_NULL_PROMISE]: () => ({
    type: `${defaultAction.type}_FULFILLED`,
    payload: undefined,
  }),
  [types.FULFILLED_NUMBER_PROMISE]: () => ({
    type: `${defaultAction.type}_FULFILLED`,
    payload: 21,
  }),
  [types.REJECTED]: () => ({
    type: `${defaultAction.type}_REJECTED`,
    payload: defaultError,
    error: true,
  }),
};

// Get action creators
export const getActionCreator = (actionType) => {
  const action = actions[actionType];

  if (action) {
    return action;
  }

  throw new Error(`Action with type ${actionType} is not found.`);
};
