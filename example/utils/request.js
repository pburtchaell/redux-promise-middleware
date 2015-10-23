import 'core-js/shim';
import 'regenerator/runtime';
import 'isomorphic-fetch';

/**
 * @private
 * @function request
 * @description Make a request to the server and return a promise.
 * @param {string} url
 * @param {object} options
 * @returns {promise}
 */
export default function request(url, options) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('There is no URL provided for the request.'));
    }

    if (!options) {
      reject(new Error('There are no options provided for the request.'));
    }

    fetch(url, options).then(response => {
      return response.json();
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.errors ? reject(response.errors) : reject(response);
      } else {
        return resolve(response)
      }
    }).catch(error => {
      reject(error);
    });
  });
}
