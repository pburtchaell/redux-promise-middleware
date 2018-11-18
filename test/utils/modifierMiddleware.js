/*
 * Function: modifierMiddleware
 * Description: Modifies actions with a given modifier object
 */
function modifierMiddleware(spy, modifier) {
  return () => next => action => {
    const modifiedAction = Object.assign(action, modifier);

    spy(modifiedAction);

    return next(modifiedAction);
  };
}

export default modifierMiddleware;
