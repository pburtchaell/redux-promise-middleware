import isPromise from './isPromise';

export const PENDING = 'PENDING';
export const FULFILLED = 'FULFILLED';
export const REJECTED = 'REJECTED';

const defaultTypes = [PENDING, FULFILLED, REJECTED];
const IS_ERROR = true;

export default function promiseMiddleware(config = {}) {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;

  return ({ dispatch }) => {
    return next => action => {
      if (!isPromise(action.payload)) {
        return next(action);
      }

      const { type, payload, meta } = action;
      const { promise, data } = payload;
      const [
        _PENDING,
        _FULFILLED,
        _REJECTED
      ] = (meta || {}).promiseTypeSuffixes || promiseTypeSuffixes;

     /**
      * Dispatch the first async handler. This tells the
      * reducer that an async action has been dispatched.
      */
      next({
        type: `${type}_${_PENDING}`,
        ...!data ? {} : { payload: data },
        ...!meta ? {} : { meta }
      });

      const isThunk = resolved => typeof resolved === 'function';

      const getPartialAction = (isError) => ({
        type: `${type}_${isError ? _REJECTED : _FULFILLED}`,
        ...meta === undefined ? {} : { meta },
        ...!isError ? {} : { error: true }
      });

      /**
       * Re-dispatch one of:
       *  1. a thunk, bound to a resolved/rejected object containing ?meta and type
       *  2. a resolve/rejected action with the resolve/rejected object as a payload
       */
      promise.then(
        (resolved={}) => {
          const resolveAction = getPartialAction();
          dispatch(
            isThunk(resolved)
              ? resolved.bind(null, resolveAction)
              : {
                ...resolveAction,
                ...(resolved === undefined) ? {} : { payload: resolved }
              }
          );
        },
        (rejected={}) => {
          const rejectedAction = getPartialAction(IS_ERROR);
          dispatch(
            isThunk(rejected)
              ? rejected.bind(null, rejectedAction)
              : {
                ...rejectedAction,
                ...(rejected === undefined) ? {} : { payload: rejected }
              }
          );
        },
      ).catch(error =>
        // log out any errors thrown as a result of the dispatch in this promise
        console.error(error) // eslint-disable-line
      );

      return promise;
    };
  };
}
