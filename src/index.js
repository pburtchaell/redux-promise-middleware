import isPromise from './isPromise';

const defaultTypes = ['PENDING', 'FULFILLED', 'REJECTED'];

/**
 * @function promiseMiddleware
 * @description
 * @returns {function} thunk
 */
module.exports = function promiseMiddleware(config = {}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;

  return ref => {
    const { dispatch } = ref;

    return next => action => {
      // Deconstruct the properties of the original action object to constants
      const { type, payload, meta } = action;

      const validType = typeof type === 'string';
      const validPayload = payload && (isPromise(payload) || isPromise(payload.promise));

      if (!validType || !validPayload) {
        return next(action);
      }

      // Assign values for promise type suffixes
      const [
        PENDING,
        FULFILLED,
        REJECTED
      ] = (meta || {}).promiseTypeSuffixes || promiseTypeSuffixes;

      /**
       * @function getAction
       * @description Utility function for creating a rejected or fulfilled
       * flux standard action object.
       * @param {object} newPayload - payload of new
       * @param {boolean} isRejected - Is promise rejected?
       * @returns {object} action
       */
      const getAction = (newPayload, isRejected) => ({
        type: `${type}_${isRejected ? REJECTED : FULFILLED}`,
        ...newPayload ? {
          payload: newPayload
        } : {},
        ...!!meta ? { meta } : {},
        ...isRejected ? {
          error: true
        } : {}
      });

      /**
       * Assign values for promise and data variables. In the case the payload
       * is an object with a `promise` and `data` property, the values of those
       * properties will be used. In the case the payload is a promise, the
       * value of the payload will be used and data will be null.
       */
      let promise;
      let data;

      if (!isPromise(action.payload) && typeof action.payload === 'object') {
        promise = payload.promise;
        data = payload.data;
      } else {
        promise = payload;
        data = null;
      }

      /**
       * First, dispatch the pending action. This flux standard action object
       * describes the pending state of a promise and will include any data
       * (for optimistic updates) and/or meta from the original action.
       */
      next({
        type: `${type}_${PENDING}`,
        ...!!data ? { payload: data } : {},
        ...!!meta ? { meta } : {}
      });

      /*
       * @function handleReject
       * @description Dispatch the rejected action and return
       * an error object. The error object should contain the
       * reason and the dispatched action.
       * @params reason The reason the promise was rejected
       * @returns {object}
       */
      const handleReject = (reason = null) => {
        const rejectedAction = getAction(reason, true);
        dispatch(rejectedAction);

        const error = reason instanceof Error ? reason : new Error();

        error.reason = reason;
        error.action = rejectedAction;

        throw error;
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
};
