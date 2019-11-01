import isPromise from './isPromise.js';

/**
 * For TypeScript support: Remember to check and make sure
 * that `index.d.ts` is also up to date with the implementation.
 */
export const ActionType = {
  Pending: 'PENDING',
  Fulfilled: 'FULFILLED',
  Rejected: 'REJECTED',
};

/**
 * Function: createPromise
 * Description: The main createPromise accepts a configuration
 * object and returns the middleware.
 */
export function createPromise(config = {}) {
  const defaultTypes = [ActionType.Pending, ActionType.Fulfilled, ActionType.Rejected];
  const PROMISE_TYPE_SUFFIXES = config.promiseTypeSuffixes || defaultTypes;
  const PROMISE_TYPE_DELIMITER = config.promiseTypeDelimiter || '_';

  return ref => {
    const { dispatch } = ref;

    return next => action => {

      /**
       * Instantiate variables to hold:
       * (1) the promise
       * (2) the data for optimistic updates
       */
      let promise;
      let data;

      /**
       * There are multiple ways to dispatch a promise. The first step is to
       * determine if the promise is defined:
       * (a) explicitly (action.payload.promise is the promise)
       * (b) implicitly (action.payload is the promise)
       * (c) as an async function (returns a promise when called)
       *
       * If the promise is not defined in one of these three ways, we don't do
       * anything and move on to the next middleware in the middleware chain.
       */

      // Step 1a: Is there a payload?
      if (action.payload) {
        const PAYLOAD = action.payload;

        // Step 1.1: Is the promise implicitly defined?
        if (isPromise(PAYLOAD)) {
          promise = PAYLOAD;
        }

        // Step 1.2: Is the promise explicitly defined?
        else if (isPromise(PAYLOAD.promise)) {
          promise = PAYLOAD.promise;
          data = PAYLOAD.data;
        }

        // Step 1.3: Is the promise returned by an async function?
        else if (
          typeof PAYLOAD === 'function' ||
          typeof PAYLOAD.promise === 'function'
        ) {
          promise = PAYLOAD.promise ? PAYLOAD.promise() : PAYLOAD();
          data = PAYLOAD.promise ? PAYLOAD.data : undefined;

          // Step 1.3.1: Is the return of action.payload a promise?
          if (!isPromise(promise)) {

            // If not, move on to the next middleware.
            return next({
              ...action,
              payload: promise
            });
          }
        }

        // Step 1.4: If there's no promise, move on to the next middleware.
        else {
          return next(action);
        }

      // Step 1b: If there's no payload, move on to the next middleware.
      } else {
        return next(action);
      }

      /**
       * Instantiate and define constants for:
       * (1) the action type
       * (2) the action meta
       */
      const TYPE = action.type;
      const META = action.meta;

      /**
       * Instantiate and define constants for the action type suffixes.
       * These are appended to the end of the action type.
       */
      const [
        PENDING,
        FULFILLED,
        REJECTED
      ] = PROMISE_TYPE_SUFFIXES;

      /**
       * Function: getAction
       * Description: This function constructs and returns a rejected
       * or fulfilled action object. The action object is based off the Flux
       * Standard Action (FSA).
       *
       * Given an original action with the type FOO:
       *
       * The rejected object model will be:
       * {
       *   error: true,
       *   type: 'FOO_REJECTED',
       *   payload: ...,
       *   meta: ... (optional)
       * }
       *
       * The fulfilled object model will be:
       * {
       *   type: 'FOO_FULFILLED',
       *   payload: ...,
       *   meta: ... (optional)
       * }
       */
      const getAction = (newPayload, isRejected) => ({
        // Concatenate the type string property.
        type: [
          TYPE,
          isRejected ? REJECTED : FULFILLED
        ].join(PROMISE_TYPE_DELIMITER),

        // Include the payload property.
        ...((newPayload === null || typeof newPayload === 'undefined') ? {} : {
          payload: newPayload
        }),

        // If the original action includes a meta property, include it.
        ...(META !== undefined ? { meta: META } : {}),

        // If the action is rejected, include an error property.
        ...(isRejected ? {
          error: true
        } : {})
      });

      /**
       * Function: handleReject
       * Calls: getAction to construct the rejected action
       * Description: This function dispatches the rejected action and returns
       * the original Error object. Please note the developer is responsible
       * for constructing and throwing an Error object. The middleware does not
       * construct any Errors.
       */
      const handleReject = reason => {
        const rejectedAction = getAction(reason, true);
        dispatch(rejectedAction);

        throw reason;
      };

      /**
       * Function: handleFulfill
       * Calls: getAction to construct the fullfilled action
       * Description: This function dispatches the fulfilled action and
       * returns the success object. The success object should
       * contain the value and the dispatched action.
       */
      const handleFulfill = (value = null) => {
        const resolvedAction = getAction(value, false);
        dispatch(resolvedAction);

        return { value, action: resolvedAction };
      };

      /**
       * First, dispatch the pending action:
       * This object describes the pending state of a promise and will include
       * any data (for optimistic updates) and/or meta from the original action.
       */
      next({
        // Concatenate the type string.
        type: [TYPE, PENDING].join(PROMISE_TYPE_DELIMITER),

        // Include payload (for optimistic updates) if it is defined.
        ...(data !== undefined ? { payload: data } : {}),

        // Include meta data if it is defined.
        ...(META !== undefined ? { meta: META } : {})
      });

      /**
       * Second, dispatch a rejected or fulfilled action and move on to the
       * next middleware.
       */
      return promise.then(handleFulfill, handleReject);
    };
  };
}

export default function middleware({ dispatch } = {}) {
  if (typeof dispatch === 'function') {
    return createPromise()({ dispatch });
  }

  if (process && process.env && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(`Redux Promise Middleware: As of version 6.0.0, the \
middleware library supports both preconfigured and custom configured \
middleware. To use a custom configuration, use the "createPromise" export \
and call this function with your configuration property. To use a \
preconfiguration, use the default export. For more help, check the upgrading \
guide: https://docs.psb.design/redux-promise-middleware/upgrade-guides/v6

For custom configuration:
import { createPromise } from 'redux-promise-middleware';
const promise = createPromise({ types: { fulfilled: 'success' } });
applyMiddleware(promise);

For preconfiguration:
import promise from 'redux-promise-middleware';
applyMiddleware(promise);
    `);
  }

  return null;
}
