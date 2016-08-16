import * as types from '../constants/error';

/**
 * @function rejectPromiseWithGlobalError ✨
 * @description This function demonstrates how to handle a rejected
 * promise "globally" in the middleware.
 * @param message {string} the error message
 * @returns {object}
 */
export const rejectPromiseWithGlobalError = message => ({
  type: types.GLOBAL_ERROR,
  payload: new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(message))
    }, 2000);
  })
});

/**
 * @function throwLocalError ✨
 * @description This function demonstrates how to handle a rejected
 * promise locally in the action creator.
 * @param message {string} the error message
 * @returns {object} the promise
 */
export const rejectPromiseWithLocalError = message => dispatch => ({
  type: types.LOCAL_ERROR,
  payload: new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(message))
    }, 2000);
  }).catch(error => {
    console.warn(`
      ${types.LOCAL_ERROR} rejected locally with reason: \
      "${JSON.stringify(error.message)}".
    `);
  });
});
