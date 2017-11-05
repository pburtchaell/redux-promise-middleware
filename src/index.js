import isPromise from './isPromise.js';

export const PENDING = 'PENDING';
export const FULFILLED = 'FULFILLED';
export const REJECTED = 'REJECTED';
export const STATEMACHINE = Symbol('ASYNC_STATE_MACHINE');

const defaultTypes = [PENDING, FULFILLED, REJECTED];

/**
 * @function promiseMiddleware
 * @description
 * @returns {function} thunk
 */
export default function promiseMiddleware(config = {}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;
  const promiseTypeSeparator = config.promiseTypeSeparator || '_';
  const stateMachine = config.isOpenStateType

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
	   * @function getStateAction
	   * @description Utility function for creating a action about the action state
	   * @param  {Boolean} isFetching now this action is fetching or end ?
	   * @return {object}  action
	   */
	  const getStateAction = isFetching => ({
		  type: STATEMACHINE,
		  actionType: type,
		  isFetching
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
        data = undefined;
      }

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

	  /**
	   * if had the Configuration will dispatch a `true` action, to tell user this action's type
	   * is fetching data now. and on the end of the promise will dispatch the `false` action whether
	   * the promise is rejected or fulfilled
	   */
	  if (stateMachine) {next(getStateAction(true))};

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
	  	if (stateMachine) {next(getStateAction(false))};

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
		if (stateMachine) {next(getStateAction(false))};

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
