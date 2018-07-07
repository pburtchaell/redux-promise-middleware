import isPromise from 'is-promise';
import _ from 'underscore';

export default function errorMiddleware() {
  return next => action => {
    const types = {
      FOO: true,
    };

    // If not a promise, continue on
    if (!isPromise(action.payload)) {
      return next(action);
    }

    /*
     * Another solution would would be to include a property in `meta`
     * and evaulate that property.
     *
     * if (action.meta.globalError === true) {
     *   // handle error
     * }
     *
     * The error middleware serves to dispatch the initial pending promise to
     * the promise middleware, but adds a `catch`.
     */
    if (_.has(types, action.type)) {

      // Dispatch initial pending promise, but catch any errors
      return next(action).catch(error => {
        console.warn(error);

        return error;
      });
    }

    return next(action);
  };
}
