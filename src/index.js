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
     * reducer that a async action has been dispatched.
     */
    next({
      type: PENDING
    });

    /**
     * Return the promise. This will allow us to return
     * either the fulfilled promise object or the rehjected
     * promise object.
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
