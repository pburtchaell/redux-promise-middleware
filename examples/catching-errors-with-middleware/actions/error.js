/*
 * Function rejectPromiseWithGlobalError
 * Description: This function demonstrates how to handle a rejected
 * promise "globally" in the middleware.
 */
export const rejectPromiseWithGlobalError = message => dispatch => dispatch({
  type: 'GLOBAL_ERROR',
  payload: new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, 1000);
  })
});

/*
 * Function throwLocalError
 * Description: This function demonstrates how to handle a rejected
 * promise locally in the action creator.
 */
export const rejectPromiseWithLocalError = message => dispatch => dispatch({
  type: 'LOCAL_ERROR',
  payload: new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, 1000);
  })
}).catch(error => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `Local error caught at action creator: \
       ${JSON.stringify(error.message)}.`
    );
  }
});
