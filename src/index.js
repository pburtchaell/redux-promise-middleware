import isPromise from './isPromise';

export const PENDING = 'PENDING';
export const FULFILLED = 'FULFILLED';
export const REJECTED = 'REJECTED';

const defaultTypes = [PENDING, FULFILLED, REJECTED];

/**
 * @function promiseMiddleware
 * @description
 * @returns {function} thunk
 */
export default function promiseMiddleware(config = {}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;
  const promiseTypeSeparator = config.promiseTypeSeparator || '_';

  return ref => {
    const { dispatch, getState } = ref;

    return next => action => {
      let promise = null;
      let data = null;

      if (action.payload) {
        data = action.payload.data;

        // If there is a payload and it has a promise attribute, we'll try
        // that
        if (action.payload.promise) {
          promise = action.payload.promise;

        // Otherwise we'll try the payload
        } else {
          promise = action.payload;
        }
      // If there's no payload just return early.
      } else {
        return next(action);
      }

      // If the promise we're tracking is a native async we can call it knowing
      // full well the result will be a promise.
      if (promise.constructor.name === 'AsyncFunction') {
        promise = promise(dispatch, getState);

      // If it's a regular function, call it and see if it returns a promise.
      } else if (typeof promise === 'function') {
        const functionResult = promise(dispatch, getState);

        // If it is a promise, awesome, let's use it.
        if (isPromise(functionResult)) {
          promise = functionResult;

        // Return early if otherwise. We might be messing with some other redux
        // middleware at this point.
        // TODO Should we always pass `action` or `functionResult` to `next`? Or
        // keep what's here.
        } else {
          return next({
            type: action.type,
            payload: functionResult,
            ...(action.meta !== undefined ? action.meta : {})
          });
        }
      }

      // If at this point what we're tracking isn't a promise, just give up.
      if (!isPromise(promise)) {
        return next(action);
      }

      // Deconstruct the properties of the original action object to constants
      const { type, meta } = action;

      // Assign values for promise type suffixes
      const [
        _PENDING,
        _FULFILLED,
        _REJECTED
      ] = promiseTypeSuffixes;

      /**
       * @function getAction
       * @description Utility function for creating a rejected or fulfilled
       * flux standard action object.
       * @param {boolean} Is the action rejected?
       * @returns {object} action
       */
      const getAction = (newPayload, isRejected) => ({
        type: [type, isRejected ? _REJECTED : _FULFILLED].join(promiseTypeSeparator),
        ...((newPayload === null || typeof newPayload === 'undefined') ? {} : {
          payload: newPayload
        }),
        ...(meta !== undefined ? { meta } : {}),
        ...(isRejected ? {
          error: true
        } : {})
      });

      /**
       * First, dispatch the pending action. This flux standard action object
       * describes the pending state of a promise and will include any data
       * (for optimistic updates) and/or meta from the original action.
       */
      next({
        type: [type, _PENDING].join(promiseTypeSeparator),
        ...(data !== undefined ? { payload: data } : {}),
        ...(meta !== undefined ? { meta } : {})
      });

      /*
       * @function handleReject
       * @description Dispatch the rejected action and return
       * an error object. The error object is the original error
       * that was thrown. The user of the library is responsible for
       * best practices in ensure that they are throwing an Error object.
       * @params reason The reason the promise was rejected
       * @returns {object}
       */
      const handleReject = reason => {
        const rejectedAction = getAction(reason, true);
        dispatch(rejectedAction);

        throw reason;
      };

      /*
       * @function handleFulfill
       * @description Dispatch the fulfilled action and
       * return the success object. The success object should
       * contain the value and the dispatched action.
       * @param value The value the promise was resloved with
       * @returns {object}
       */
      const handleFulfill = (value = null) => {
        const resolvedAction = getAction(value, false);
        dispatch(resolvedAction);

        return { value, action: resolvedAction };
      };

      /**
       * Second, dispatch a rejected or fulfilled action. This flux standard
       * action object will describe the resolved state of the promise. In
       * the case of a rejected promise, it will include an `error` property.
       *
       * In order to allow proper chaining of actions using `then`, a new
       * promise is constructed and returned. This promise will resolve
       * with two properties: (1) the value (if fulfilled) or reason
       * (if rejected) and (2) the flux standard action.
       *
       * Rejected object:
       * {
       *   reason: ...
       *   action: {
       *     error: true,
       *     type: 'ACTION_REJECTED',
       *     payload: ...
       *   }
       * }
       *
       * Fulfilled object:
       * {
       *   value: ...
       *   action: {
       *     type: 'ACTION_FULFILLED',
       *     payload: ...
       *   }
       * }
       */
      return promise.then(handleFulfill, handleReject);
    };
  };
}
