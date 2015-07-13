import isPromise from './isPromise';

export default function promiseMiddleware(next) {
  return action => {
    if (!isPromise(action.payload)) {
      return next(action);
    }

    const { types } = action;
    const promise = action.payload;
    const [ PENDING, FULFILLED, REJECTED ] = types;

    /**
     * Dispatch the first async handler. This tells the
     * reducer that an async action has been dispatched.
     */
    next({
      type: PENDING
    });

    /**
     * Return either the fulfilled action object or the rejected
     * action object.
     */
    return promise.then(
      payload => next({
        payload,
        type: FULFILLED
      }),
      error => next({
        error,
        type: REJECTED
      })
    );
  };
}
