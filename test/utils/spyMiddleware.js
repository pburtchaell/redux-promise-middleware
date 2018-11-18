/*
 * Function: spyMiddleware
 * Description: Tracks dispached actions with a given spy/mock function
 */
function spyMiddleware(spy) {
  return () => next => action => {
    spy(action);

    return next(action);
  };
}

export default spyMiddleware;
