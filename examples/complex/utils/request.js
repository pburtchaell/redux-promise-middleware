/**
 * @private
 * @function request
 * @description Make a request to the server and return a promise.
 * @param {string} url
 * @param {object} options
 * @returns {promise}
 */
export default function request(url, options) {
    if (!url) return Promise.reject(new Error('URL parameter required'));
    if (!options) return Promise.reject(new Error('Options parameter required'));

    return fetch(url, options)
      .then(response => response.json())
      .then(response => {
        if (response.errors) throw response.errors; //TODO: reconsider throwing stuff without stack traces
        return response;
      });
  });
}
