import isPromise from './isPromise';

const defaultTypes = ['PENDING', 'FULFILLED', 'REJECTED']

export default function promiseMiddleware(config) {
  const promiseTypes = config.promiseTypes || defaultTypes;
  return next => action => {
    if (!isPromise(action.payload)) {
      return next(action);
    }

    const { type, payload, meta } = action;
    const { promise, data } = payload;
    const [ PENDING, FULFILLED, REJECTED ] = meta.promiseTypes || promiseTypes

    /**
     * Dispatch the first async handler. This tells the
     * reducer that an async action has been dispatched.
     */
    next({
      type: `${type}_${PENDING}`,
      payload: data,
      meta
    });

    /**
     * Return either the fulfilled action object or the rejected
     * action object.
     */
    return promise.then(
      payload => next({
        payload,
        meta,
        type: `${type}_${FULFILLED}`,
      }),
      error => next({
        payload: error,
        error: true,
        type: `${type}_${REJECTED}`,
      })
    );
  };
}
