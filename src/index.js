import isPromise from './isPromise';

export default function promiseMiddleware(config = {
 promiseTypeSuffixes: ['PENDING', 'FULFILLED', 'REJECTED']
}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes;
  
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
        ...data && { payload: data },
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
            ...resolved && { payload: resolved },
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
