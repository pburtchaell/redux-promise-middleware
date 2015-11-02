import isPromise from './isPromise';

const defaultTypes = ['PENDING', 'FULFILLED', 'REJECTED'];

export default function promiseMiddleware(config={}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;
  return () => {
    return next => action => {
      if (!isPromise(action.payload)) {
        return next(action);
      }

      const { type, payload, meta } = action;
      const { promise, data } = payload;
      const [ PENDING, FULFILLED, REJECTED ] = (meta || {}).promiseTypeSuffixes || promiseTypeSuffixes;

     /**
      * Dispatch the first async handler. This tells the
      * reducer that an async action has been dispatched.
      */
      next({
        type: `${type}_${PENDING}`,
        payload: data,
        ...meta && { meta }
      });

      /**
       * Return either the fulfilled action object or the rejected
       * action object.
       */
      return promise.then(
        resolved => next({ // eslint-disable-line no-shadow
          type: `${type}_${FULFILLED}`,
          ...resolved.meta || resolved.payload ? resolved : {
            payload: resolved,
            ...meta && { meta }
          }
        }),
        error => next({
          type: `${type}_${REJECTED}`,
          payload: error,
          error: true,
          ...meta && { meta }
        })
      );
    };
  };
}
