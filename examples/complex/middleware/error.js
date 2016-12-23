import isPromise from '../utils/isPromise';
import oneOfType from '../utils/oneOfType';
import * as errorTypes from '../constants/error';

export default function errorMiddleware() {
  return next => action => {
    let result = next(action);

    const types = [
      errorTypes.GLOBAL_ERROR
    ];

    if (!isPromise(result)) {
      return action;
    }

    /**
     * Because it iterates on an array for every async action, this
     * oneOfType function could be expensive to call in production. Another solution
     * would would be to include a property in `meta` and evaulate that property.
     *
     * if (action.meta.globalError === true) {
     *   // handle error
     * }
     */
    if (oneOfType(action.type, types)) {
      return result.catch(error => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`${action.type} caught at middleware with reason: ${JSON.stringify(error.message)}.`);
        }

        return error;
      });
    }

    return result;
  };
}
