import isPromise from './isPromise';

const defaultTypes = ['PENDING', 'FULFILLED', 'REJECTED'];

export default function promiseMiddleware(config = {}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;

  return (_ref) => {
    const dispatch = _ref.dispatch;

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

      const isAction = resolved => resolved.meta || resolved.payload;

      const isThunk = resolved => typeof resolved === 'function';
      /**
       * Return either the fulfilled action object or the rejected
       * action object.
       */
      return promise.then(
        (resolved={}) => isThunk(resolved) ? dispatch(resolved) : dispatch({
          type: `${type}_${FULFILLED}`,
          ...isAction(resolved) ? resolved : {
            ...resolved && { payload: resolved },
            ...meta && { meta }
          }
        }),
        (resolved={}) => isThunk(resolved) ? dispatch(resolved) : dispatch({
          type: `${type}_${REJECTED}`,
          ...isAction(resolved) ? resolved : {
            error: true,
            ...resolved && { payload: resolved },
            ...meta && { meta }
          }
        })
      );
    };
  };
}
