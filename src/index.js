import isPromise from './isPromise';

export default function promiseMiddleware() {
  return next => action => {
    if (!isPromise(action.payload)) {
      return next(action);
    }

    const { type, meta } = action;
    const { promise, data } = action.payload;
    const [ PENDING, FULFILLED, REJECTED ] = type;

    /**
     * Dispatch the first async handler. This tells the
     * reducer that an async action has been dispatched.
     */
    next({
      type: PENDING,
      payload: data,
      meta
    });

    /**
     * Return either the fulfilled action object or the rejected
     * action object.
     */
    return promise.then(
      payload => next({
        type: FULFILLED,
        payload,
        meta
      }),
      error => next({
        type: REJECTED,
        payload: error,
        error: true,
        meta
      })
    );
  };
}
