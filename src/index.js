import isPromise from './isPromise';

const defaultTypes = ['PENDING', 'FULFILLED', 'REJECTED'];

/**
 * @function promiseMiddleware
 * @description
 * @returns {function} thunk
 */
export default function promiseMiddleware(config = {}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;

  return ref => {
    const { dispatch } = ref;

    return next => action => {
      if (action.payload) {
        if (!isPromise(action.payload) && !isPromise(action.payload.promise)) {
          return next(action);
        }
      } else {
        return next(action);
      }

      // Deconstruct the properties of the original action object to constants
      const { type, payload, meta } = action;

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
       * @param {boolean} Is the action rejected?
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
      action = new Promise((resolve, reject) => {
        promise.then(
          (value = null) => {
            const resolvedAction = getAction(value, false);
            dispatch(resolvedAction);
            resolve({ value, action: resolvedAction });

            return;
          },
          (reason = null) => {
            const rejectedAction = getAction(reason, true);
            dispatch(rejectedAction);
            reject({ reason, action: rejectedAction });

            return;
          }
        );
      });

      // Always return the original action so other middleware can access it
      return action;
    };
  };
}
